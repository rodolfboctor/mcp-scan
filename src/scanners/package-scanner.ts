import { ResolvedServer } from '../types/config.js';
import { Finding, FindingId } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';
import { parseCvssVector } from 'vuln-vects';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import semver from 'semver';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.join(__dirname, '../data/cve-snapshot.json');

/**
 * Deep audit of a package, either online or using a bundled snapshot.
 */
export async function scanPackageDeep(server: ResolvedServer, offline: boolean = false): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    const pkgArg = (Array.isArray(server.args) ? server.args : (server.args ? Object.values(server.args) : [])).find(a => typeof a === 'string' && !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg as string;
  }

  if (!packageName) return findings;

  if (offline) {
    return scanPackageOffline(packageName);
  }

  let latestVersion = '';
  try {
    const npmController = new AbortController();
    const npmTimeoutId = setTimeout(() => npmController.abort(), 8000);
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`, {
      signal: npmController.signal,
    });
    clearTimeout(npmTimeoutId);
    if (!res.ok) {
      logger.warn(`Failed to fetch package info for ${packageName} from npm registry.`);
    } else {
      const data = await res.json() as any;
      latestVersion = data['dist-tags']?.latest || '';
      if (data && typeof data === 'object' && data.time && typeof data.time.modified === 'string') {
        const lastModified = new Date(data.time.modified);
        const now = new Date();
        const diffMonths = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (diffMonths > 6) {
          findings.push({
            id: 'stale-server',
            severity: 'HIGH',
            description: `npm package '${packageName}' has not been updated in over 6 months.`,
          });
        }
      }
    }
  } catch (_error) {
    logger.warn(`Network error fetching npm registry for ${packageName}. Switching to offline mode.`);
    return scanPackageOffline(packageName);
  }

  // OSV.dev integration
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const osvRes = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package: { name: packageName, ecosystem: 'npm' } }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!osvRes.ok) {
      logger.warn(`OSV.dev API request failed for ${packageName}.`);
      return findings;
    }

    const osvData = await osvRes.json() as any;
    const vulns = osvData.vulns || [];

    if (vulns.length > 0) {
      for (const vuln of vulns) {
        let cvssScore = 0;
        if (vuln.severity && Array.isArray(vuln.severity)) {
          for (const severity of vuln.severity) {
            if (severity.type === 'CVSS_V3' && severity.score) {
              try {
                const parsedScore = parseCvssVector(severity.score);
                if (parsedScore && typeof parsedScore.baseScore === 'number') {
                  cvssScore = parsedScore.baseScore;
                  break;
                }
              } catch (_error) {}
            }
          }
        }
        
        if (cvssScore >= 9.0) {
          findings.push({
            id: 'known-vulnerability-critical' as FindingId,
            severity: 'CRITICAL',
            description: `Critical vulnerability found in '${packageName}': ${vuln.id} - ${vuln.summary || vuln.details}`,
            fixRecommendation: `Upgrade package or remove it.`,
            fixable: true,
          });
        } else if (cvssScore >= 7.0) {
          findings.push({
            id: 'known-vulnerability-high' as FindingId,
            severity: 'HIGH',
            description: `High vulnerability found in '${packageName}': ${vuln.id} - ${vuln.summary || vuln.details}`,
            fixRecommendation: `Upgrade package or remove it.`,
            fixable: true,
          });
        }
      }
    }

    // Upgrade Advisor Logic
    if (latestVersion) {
        const currentVersion = server.metadata?.version;
        if (currentVersion && semver.valid(currentVersion) && semver.valid(latestVersion) && semver.gt(latestVersion, currentVersion)) {
            const resolvesVulns = vulns.some((v: any) => v.fixed_in?.includes(latestVersion) || !v.affected?.some((a: any) => a.ranges?.some((r: any) => r.type === 'SEMVER' && r.events?.some((e: any) => e.fixed === latestVersion))));
            
            findings.push({
                id: 'upgrade-available',
                severity: 'INFO',
                description: `A newer version of '${packageName}' is available: ${currentVersion} → ${latestVersion}.`,
                fixRecommendation: resolvesVulns 
                    ? `UPGRADE RECOMMENDED: Version ${latestVersion} may resolve known vulnerabilities. Run: npm install ${packageName}@${latestVersion}`
                    : `Run: npm install ${packageName}@${latestVersion} to update.`,
                fixable: true
            });
        }
    }

  } catch (_error) {
    logger.warn(`OSV.dev API request for ${packageName} failed or timed out. Switching to offline snapshot.`);
    return [...findings, ...scanPackageOffline(packageName)];
  }

  return findings;
}

function scanPackageOffline(packageName: string): Finding[] {
  const findings: Finding[] = [];
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) return findings;
    
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    
    // Check if snapshot is stale (> 30 days)
    const updatedAt = new Date(snapshot.updatedAt);
    const now = new Date();
    const diffDays = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      logger.warn(`CVE snapshot is ${Math.floor(diffDays)} days old. Run 'npm run update-cve-snapshot' to update.`);
    }

    const pkgData = snapshot.packages[packageName];
    if (pkgData && pkgData.vulns) {
      for (const vuln of pkgData.vulns) {
        findings.push({
          id: vuln.severity === 'CRITICAL' ? 'known-vulnerability-critical' : 'known-vulnerability-high',
          severity: vuln.severity,
          description: `Bundled snapshot found ${vuln.severity} vulnerability in '${packageName}': ${vuln.id} - ${vuln.summary}`,
          fixRecommendation: `Upgrade package or remove it. (Offline info)`
        });
      }
    }
  } catch (_error) {}
  return findings;
}
