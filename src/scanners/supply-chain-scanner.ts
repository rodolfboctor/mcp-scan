import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.join(__dirname, '../data/cve-snapshot.json');

interface RepoMetadata {
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt: string;
  contributorCount: number;
  owner: string;
}

export interface SupplyChainResult {
  findings: Finding[];
  trustScore: number;
  metadata?: {
    packageName?: string;
    version?: string;
    license?: string;
    repositoryUrl?: string;
    author?: string;
    source?: 'npm' | 'local' | 'unknown';
  };
}

export async function scanSupplyChain(server: ResolvedServer, offline: boolean = false): Promise<SupplyChainResult> {
  const findings: Finding[] = [];
  let trustScore = 50; // Neutral starting point
  const metadata: SupplyChainResult['metadata'] = { source: 'local' };

  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    const pkgArg = (Array.isArray(server.args) ? server.args : (server.args ? Object.values(server.args) : [])).find(a => typeof a === 'string' && !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg as string;
  }

  if (!packageName) return { findings, trustScore: 100, metadata };

  if (offline) {
    return scanSupplyChainOffline(packageName);
  }

  metadata.source = 'npm';
  metadata.packageName = packageName;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const npmRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!npmRes.ok) {
      logger.warn(`Supply Chain: Failed to fetch npm registry data for ${packageName}. Switching to offline snapshot.`);
      return scanSupplyChainOffline(packageName);
    }

    const npmData = await npmRes.json() as any;
    const repoUrl = extractRepoUrl(npmData);
    
    metadata.version = npmData['dist-tags']?.latest;
    metadata.license = npmData.license || npmData.licenses?.[0]?.type || npmData.licenses?.[0];
    metadata.author = npmData.author?.name || npmData.author;
    metadata.repositoryUrl = repoUrl || undefined;

    if (!repoUrl) {
      findings.push({
        id: 'supply-chain-low-trust',
        severity: 'MEDIUM',
        description: `Package '${packageName}' has no public repository URL linked.`,
        fixRecommendation: 'Verify the authenticity of this package manually.'
      });
      return { findings, trustScore: 20, metadata };
    }

    const githubMeta = await fetchGitHubMetadata(repoUrl);
    if (!githubMeta) {
      logger.warn(`Supply Chain: Failed to fetch GitHub metadata for ${repoUrl}.`);
      return { findings, trustScore: 40, metadata };
    }

    trustScore = calculateTrustScore(githubMeta);

    if (trustScore < 40) {
      findings.push({
        id: 'supply-chain-low-trust',
        severity: 'MEDIUM',
        description: `Package '${packageName}' has a low supply chain trust score (${trustScore}/100).`,
        fixRecommendation: 'This package has low activity, few stars, or is unmaintained. Audit the source code before use.'
      });
    }

    // Check for rug pull (very basic check: compare owner in registry vs owner in current repo if we had history)
    // For now, just a placeholder for more advanced logic
    const currentOwner = githubMeta.owner;
    if (npmData.maintainers && !npmData.maintainers.some((m: any) => currentOwner.toLowerCase().includes(m.name.toLowerCase()))) {
        // This is a weak signal but could indicate a disconnect
        logger.detail(`Supply Chain: Owner mismatch detected between npm maintainers and GitHub owner for ${packageName}.`);
    }

  } catch (error: any) {
    if (error.name === 'AbortError') {
      logger.warn(`Supply Chain: Fetch timed out for ${packageName}. Switching to offline mode.`);
      return scanSupplyChainOffline(packageName);
    }
    logger.warn(`Supply Chain: Error during scan for ${packageName}: ${error instanceof Error ? error.message : String(error)}. Switching to offline mode.`);
    return scanSupplyChainOffline(packageName);
  }

  return { findings, trustScore, metadata };
}

function scanSupplyChainOffline(packageName: string): SupplyChainResult {
  const result: SupplyChainResult = { findings: [], trustScore: 30, metadata: { source: 'npm', packageName } };
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) return result;
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    const pkgData = snapshot.packages[packageName];
    if (pkgData) {
      result.metadata!.version = pkgData.version;
      result.metadata!.license = pkgData.license;
      const hasKnownCves = Array.isArray(pkgData.vulns) && pkgData.vulns.length > 0;
      result.trustScore = hasKnownCves ? 40 : 100;
    }
  } catch (_error) {}
  return result;
}

function extractRepoUrl(npmData: any): string | null {
  const repo = npmData.repository;
  if (!repo) return null;
  
  let url = typeof repo === 'string' ? repo : repo.url;
  if (!url) return null;

  // Clean up git+https, .git, etc.
  url = url.replace(/^git\+/, '').replace(/\.git$/, '').replace(/^git:/, 'https:');
  if (url.includes('github.com')) {
    return url;
  }
  return null;
}

async function fetchGitHubMetadata(repoUrl: string): Promise<RepoMetadata | null> {
  try {
    const parts = repoUrl.split('github.com/')[1].split('/');
    const owner = parts[0];
    const repo = parts[1];
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'mcp-scan'
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(apiUrl, { headers, signal: controller.signal });
    clearTimeout(timeout);
    
    if (!res.ok) return null;

    const data = await res.json() as any;
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
      contributorCount: 0, // Requires another API call, skipping for now to save rate limit
      owner: data.owner.login
    };
  } catch (_error) {
    return null;
  }
}

function calculateTrustScore(meta: RepoMetadata): number {
  let score = 0;

  // Stars: up to 40 points
  if (meta.stars > 1000) score += 40;
  else if (meta.stars > 100) score += 20;
  else if (meta.stars > 10) score += 10;

  // Forks: up to 20 points
  if (meta.forks > 100) score += 20;
  else if (meta.forks > 10) score += 10;

  // Activity (pushed in last 6 months): 40 points
  const lastPush = new Date(meta.pushedAt);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  if (lastPush > sixMonthsAgo) {
    score += 40;
  } else {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (lastPush > oneYearAgo) {
      score += 20;
    }
  }

  return Math.min(100, score);
}
