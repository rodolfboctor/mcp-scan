import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { KNOWN_ENDPOINTS } from '../data/known-endpoints.js';

export function scanNetworkEgress(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  // 1. Regex for URL patterns
  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s"']*)?/g;
  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
  // base64 encoded 'http...'
  const b64UrlRegex = /aHR0c[A-Za-z0-9+/=]+/g; 
  
  const endpoints = new Set<string>();
  
  const checkString = (str: string) => {
      const urls = str.match(urlRegex);
      if (urls) urls.forEach(u => endpoints.add(u));
      
      const ips = str.match(ipRegex);
      if (ips) ips.forEach(ip => {
         // ignore localhost/version strings that look like IPs
         if (ip !== '127.0.0.1' && ip !== '0.0.0.0' && !ip.startsWith('1.7.')) endpoints.add(ip);
      });
      
      const b64 = str.match(b64UrlRegex);
      if (b64) endpoints.add('base64-encoded-url');
  };

  // Check args
  if (server.args) {
    for (const arg of server.args) {
      if (typeof arg !== 'string') continue;
      checkString(arg);
    }
  }

  const serverStr = JSON.stringify(server).toLowerCase();
  
  if (serverStr.includes('child_process') && (serverStr.includes('exec') || serverStr.includes('spawn')) && serverStr.includes('curl')) {
      findings.push({
          id: 'network-egress-suspicious',
          severity: 'HIGH',
          description: `Server uses child_process.exec with curl, which can bypass network restrictions.`
      });
  }

  // To simulate source code static analysis, check the entire JSON
  checkString(JSON.stringify(server));

  // Non-standard port detection (not 80, 443, 8080, 3000, etc)
  const wssRegex = /wss?:\/\/[^\s"']+/g;
  const wssMatches = serverStr.match(wssRegex);
  if (wssMatches) {
      wssMatches.forEach(w => endpoints.add(w));
  }

  // Very basic port check, avoiding semver matches like 1.7.6
  if (/(https?|wss?):\/\/[a-zA-Z0-9.-]+:[0-9]{4,5}/.test(JSON.stringify(server))) {
     // but allow localhost ports
     if (!/localhost:[0-9]+/.test(JSON.stringify(server)) && !/127\.0\.0\.1:[0-9]+/.test(JSON.stringify(server))) {
         findings.push({
            id: 'network-egress-non-standard-port',
            severity: 'MEDIUM',
            description: `Server connects to non-standard ports.`
         });
     }
  }

  for (const endpoint of endpoints) {
     if (endpoint === 'base64-encoded-url') {
        findings.push({
           id: 'network-egress-obfuscated',
           severity: 'HIGH',
           description: `Server contains base64 obfuscated URLs.`
        });
        continue;
     }

     if (ipRegex.test(endpoint)) {
        findings.push({
           id: 'network-egress-raw-ip',
           severity: 'HIGH',
           description: `Server connects directly to raw IP address: ${endpoint}`
        });
        continue;
     }

     let category = 'unknown';
     for (const [cat, domains] of Object.entries(KNOWN_ENDPOINTS)) {
         if (domains.some(d => endpoint.includes(d))) {
             category = cat;
             break;
         }
     }

     if (category === 'telemetry') {
         findings.push({
             id: 'network-egress-telemetry',
             severity: 'MEDIUM',
             description: `Server contacts telemetry endpoints: ${endpoint}`,
             fixRecommendation: 'Review if telemetry collection is necessary. Block unknown endpoints.'
         });
     } else if (category === 'suspicious') {
         findings.push({
             id: 'network-egress-suspicious',
             severity: 'HIGH',
             description: `Server contacts suspicious endpoints: ${endpoint}`
         });
     } else if (category === 'api') {
         findings.push({
             id: 'network-egress-api',
             severity: 'INFO',
             description: `Server contacts known API endpoint: ${endpoint}`
         });
     } else if (category === 'unknown' && !endpoint.includes('localhost') && !endpoint.includes('127.0.0.1')) {
         findings.push({
             id: 'network-egress-unknown',
             severity: 'MEDIUM',
             description: `Server contacts unknown external endpoint: ${endpoint}`
         });
     }
  }

  // Deduplicate findings by id and description
  const uniqueFindings = [];
  const seen = new Set();
  for (const f of findings) {
      const key = `${f.id}-${f.description}`;
      if (!seen.has(key)) {
          seen.add(key);
          uniqueFindings.push(f);
      }
  }

  return uniqueFindings;
}