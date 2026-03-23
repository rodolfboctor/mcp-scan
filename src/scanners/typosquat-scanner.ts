import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { OFFICIAL_SERVERS } from '../data/official-servers.js';
import { levenshteinDistance } from '../utils/levenshtein.js';

export function scanTyposquat(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    const pkgArg = server.args?.find(a => !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg;
  } else {
    packageName = server.command;
  }

  // Remove version tags like @latest
  packageName = packageName.split('@').slice(0, packageName.startsWith('@') ? 2 : 1).join('@');

  // Skip if it's actually an official server
  if (OFFICIAL_SERVERS.has(packageName)) return findings;

  let bestMatch: { official: string, dist: number } | null = null;

  for (const official of OFFICIAL_SERVERS) {
    const officialBase = official.replace('@modelcontextprotocol/', '');
    const pkgBase = packageName.includes('/') ? packageName.split('/')[1] : packageName;
    
    const dist = levenshteinDistance(pkgBase, officialBase);
    
    if (dist > 0 && dist <= 2) {
      if (!bestMatch || dist < bestMatch.dist) {
        bestMatch = { official, dist };
      }
    }
  }

  if (bestMatch) {
    findings.push({
      id: 'typosquat-detection',
      severity: 'HIGH',
      description: `Package '${packageName}' looks suspiciously like official server '${bestMatch.official}'.`,
      fixRecommendation: `Verify you meant to install this package and not '${bestMatch.official}'.`,
      fixable: false
    });
  }

  return findings;
}
