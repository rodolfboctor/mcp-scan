import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

export function scanTransport(server: ResolvedServer, allowedDomains: string[] = []): Finding[] {
  const findings: Finding[] = [];
  
  // A simplistic check - if it's an HTTP URL in args but no headers/auth are visible
  const hasHttpArg = server.args?.some(a => {
    if (typeof a !== 'string') return false;
    const isHttp = a.startsWith('http://') || a.startsWith('https://');
    if (!isHttp) return false;
    const isAllowed = allowedDomains.some(d => a.includes(d));
    return isHttp && !isAllowed;
  });
  const hasAuthEnv = server.env && Object.keys(server.env).some(k => k.toLowerCase().includes('token') || k.toLowerCase().includes('key'));

  if (hasHttpArg && !hasAuthEnv) {
    findings.push({
      id: 'http-transport-no-auth',
      severity: 'MEDIUM',
      description: `Server connects via HTTP but no authentication credentials were found in env.`,
      fixRecommendation: `Upgrade to HTTPS if supported by the server.`,
      fixable: true,
      remediationConfidence: 90
    });
  }

  // Check for insecure URL-based server
  if (server.url?.startsWith('http://')) {
    findings.push({
      id: 'http-transport-no-auth',
      severity: 'HIGH',
      description: `Server uses insecure http:// protocol for connection.`,
      fixRecommendation: `Change the URL to use https://.`,
      fixable: true,
      remediationConfidence: 95
    });
  }

  // Check for deprecated transport mentioned in args
  if (server.args?.includes('--transport=sse')) {
     findings.push({
      id: 'outdated-transport',
      severity: 'LOW',
      description: `Server uses deprecated 'sse' transport.`,
      fixRecommendation: 'Upgrade to streamable-http transport.',
      fixable: true,
      remediationConfidence: 80
    });
  }

  // Check for explicit ws:// (unencrypted WebSocket)
  const hasInsecureWs = server.args?.some(a => typeof a === 'string' && a.startsWith('ws://'));
  if (hasInsecureWs || server.url?.startsWith('ws://')) {
    findings.push({
      id: 'insecure-transport',
      severity: 'HIGH',
      description: `Server uses unencrypted WebSocket (ws://) — data transmitted in plaintext.`,
      fixRecommendation: `Switch to encrypted WebSocket (wss://).`,
      fixable: true,
      remediationConfidence: 95
    });
  }

  return findings;
}
