import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { KNOWN_MALICIOUS_PACKAGES } from '../data/known-malicious.js';
import { OFFICIAL_SERVERS, TRUSTED_COMMUNITY_SERVERS } from '../data/official-servers.js';

export function scanRegistry(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  // Try to determine package name from command or args
  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    // npx -y @modelcontextprotocol/server-postgres
    const pkgArg = server.args?.find(a => !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg;
  } else {
    packageName = server.command;
  }

  // Guard: no package name means nothing to scan
  if (!packageName) return findings;

  // Remove version tags like @latest
  packageName = packageName.split('@').slice(0, packageName.startsWith('@') ? 2 : 1).join('@');

  if (KNOWN_MALICIOUS_PACKAGES.has(packageName)) {
    findings.push({
      id: 'known-malicious',
      severity: 'CRITICAL',
      description: `Package '${packageName}' is on the known malicious blocklist.`,
      fixRecommendation: `Remove this server immediately.`,
      fixable: false
    });
  } else if (OFFICIAL_SERVERS.has(packageName)) {
    findings.push({
      id: 'official-server',
      severity: 'INFO',
      description: `Server '${packageName}' is an official @modelcontextprotocol package.`,
    });
  } else if (TRUSTED_COMMUNITY_SERVERS.has(packageName)) {
    findings.push({
      id: 'trusted-community-server',
      severity: 'INFO',
      description: `Server '${packageName}' is a widely trusted community package.`,
    });
  } else if (!packageName.startsWith('@modelcontextprotocol/') && (server.command === 'npx' || server.command === 'npm')) {
    findings.push({
      id: 'unverified-source',
      severity: 'HIGH',
      description: `Server '${packageName}' is from an unverified source outside @modelcontextprotocol.`,
    });
  }

  return findings;
}
