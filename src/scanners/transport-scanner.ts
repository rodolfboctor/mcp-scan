import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

export function scanTransport(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  // A simplistic check - if it's an HTTP URL in args but no headers/auth are visible
  const hasHttpArg = server.args?.some(a => a.startsWith('http://') || a.startsWith('https://'));
  const hasAuthEnv = server.env && Object.keys(server.env).some(k => k.toLowerCase().includes('token') || k.toLowerCase().includes('key'));

  if (hasHttpArg && !hasAuthEnv) {
    findings.push({
      id: 'http-transport-no-auth',
      severity: 'MEDIUM',
      description: `Server connects via HTTP but no authentication credentials were found in env.`,
      fixRecommendation: `Upgrade to HTTPS if supported by the server.`,
      fixable: true
    });
  }

  // Check for deprecated transport mentioned in args
  if (server.args?.includes('--transport=sse')) {
     findings.push({
      id: 'outdated-transport',
      severity: 'LOW',
      description: `Server uses deprecated 'sse' transport.`,
    });
  }

  return findings;
}
