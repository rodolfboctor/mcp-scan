import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

const DANGEROUS_PATHS = ['/', '~', '~/.ssh', '~/.aws', '~/.gnupg'];
const BROAD_PATHS = ['/Users', '/home'];

export function scanPermissions(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  if (!server.args) return findings;

  for (const arg of server.args) {
    if (DANGEROUS_PATHS.includes(arg)) {
      findings.push({
        id: 'excessive-permissions',
        severity: 'HIGH',
        description: `Server requests access to dangerous path: '${arg}'.`,
        fixRecommendation: `Restrict access to a specific, non-sensitive directory.`,
        fixable: false
      });
    } else if (BROAD_PATHS.some(p => arg.startsWith(p) && arg.split('/').length <= 3)) {
      findings.push({
        id: 'broad-filesystem-access',
        severity: 'MEDIUM',
        description: `Server requests broad filesystem access: '${arg}'.`,
        fixRecommendation: `Restrict access to a narrower project directory.`,
        fixable: false
      });
    }
  }

  return findings;
}
