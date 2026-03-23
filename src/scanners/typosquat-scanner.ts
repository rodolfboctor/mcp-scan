import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { OFFICIAL_SERVERS, TRUSTED_COMMUNITY_SERVERS } from '../data/official-servers.js';
import { levenshteinDistance } from '../utils/levenshtein.js';

const HOMOGLYPHS: Record<string, string[]> = {
  'a': ['\u0430', '\u03b1'], // cyrillic a, greek alpha
  'e': ['\u0435', '\u03b5'], // cyrillic e, greek epsilon
  'i': ['1', 'l', '!', '\u00ec', '\u00ed'],
  'o': ['0', '\u03bf', '\u043e'], // zero, greek omicron, cyrillic o
  's': ['5', '$'],
  't': ['7'],
};

function normalizeHomoglyphs(str: string): string {
  let normalized = str.toLowerCase();
  for (const [char, glyphs] of Object.entries(HOMOGLYPHS)) {
    for (const glyph of glyphs) {
      normalized = normalized.split(glyph).join(char);
    }
  }
  return normalized;
}

export function scanTyposquat(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    const pkgArg = server.args?.find(a => !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg;
  } else {
    packageName = server.command;
  }

  if (!packageName) return findings;

  // Remove version tags like @latest
  if (packageName.startsWith('@')) {
    const parts = packageName.split('@');
    if (parts.length > 2) {
      packageName = `@${parts[1]}`;
    }
  } else {
    packageName = packageName.replace(/@[^/]+$/, '');
  }

  const ALL_TRUSTED = new Set([...OFFICIAL_SERVERS, ...TRUSTED_COMMUNITY_SERVERS]);

  // Skip if it's actually a trusted server
  if (ALL_TRUSTED.has(packageName)) return findings;

  let bestMatch: { name: string, dist: number, reason: string } | null = null;

  const normalizedPkg = normalizeHomoglyphs(packageName);
  const pkgBase = packageName.includes('/') ? packageName.split('/')[1] : packageName;
  const normalizedPkgBase = normalizeHomoglyphs(pkgBase);

  for (const trusted of ALL_TRUSTED) {
    const trustedBase = trusted.includes('/') ? trusted.split('/')[1] : trusted;
    const normalizedTrusted = normalizeHomoglyphs(trusted);
    const normalizedTrustedBase = normalizeHomoglyphs(trustedBase);

    // 1. Homoglyph check
    if (normalizedPkg === normalizedTrusted || normalizedPkgBase === normalizedTrustedBase) {
        if (!bestMatch || 0 < bestMatch.dist) {
            bestMatch = { name: trusted, dist: 0, reason: 'homoglyph substitution' };
        }
    }

    // 2. Levenshtein check
    const dist = levenshteinDistance(pkgBase, trustedBase);
    if (dist > 0 && dist <= 2) {
      if (!bestMatch || dist < bestMatch.dist) {
        bestMatch = { name: trusted, dist, reason: 'character substitution/omission' };
      }
    }

    // 3. Hyphen check
    if (pkgBase.replace(/-/g, '') === trustedBase.replace(/-/g, '')) {
        if (!bestMatch || 0 < bestMatch.dist) {
            bestMatch = { name: trusted, dist: 0, reason: 'missing or extra hyphen' };
        }
    }
  }

  if (bestMatch) {
    findings.push({
      id: 'typosquat-detection',
      severity: 'HIGH',
      description: `Package '${packageName}' looks suspiciously like trusted server '${bestMatch.name}' (${bestMatch.reason}).`,
      fixRecommendation: `Verify you meant to install this package and not '${bestMatch.name}'.`,
      fixable: false
    });
  }

  return findings;
}
