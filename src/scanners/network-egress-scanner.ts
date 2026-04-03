import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { KNOWN_ENDPOINTS } from '../data/known-endpoints.js';

export function scanNetworkEgress(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  // 1. Improved Regex for URL patterns
  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s"']*)?/g;
  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
  
  // 2. Obfuscation Patterns
  // base64 encoded 'http...' or 'https...'
  const b64UrlRegex = /aHR0c[A-Za-z0-9+/=]+|c2h0dH[A-Za-z0-9+/=]+/g; 
  // hex encoded 'http...'
  const hexUrlRegex = /68747470[A-Fa-f0-9]+/g;
  // reversed 'http' / 'https'
  const reversedUrlRegex = /\/\/:ptth|\/\/:sptth/g;
  
  const endpoints = new Set<string>();
  
  const checkString = (str: string) => {
      const urls = str.match(urlRegex);
      if (urls) urls.forEach(u => endpoints.add(u));
      
      const ips = str.match(ipRegex);
      if (ips) {
          ips.forEach(ip => {
             // ignore localhost, common internal ranges, and version strings
             const isPrivate = ip === '127.0.0.1' || ip === '0.0.0.0' || 
                               ip.startsWith('10.') || 
                               ip.startsWith('192.168.') || 
                               ip.startsWith('172.16.') ||
                               ip.startsWith('1.7.'); // Common version prefix in this project
             if (!isPrivate) endpoints.add(ip);
          });
      }
      
      if (b64UrlRegex.test(str)) endpoints.add('obfuscated:base64');
      if (hexUrlRegex.test(str)) endpoints.add('obfuscated:hex');
      if (reversedUrlRegex.test(str)) endpoints.add('obfuscated:reversed');

      // Data-in-URL detection (heuristic)
      // Look for long base64-like strings in query parameters
      const dataInUrlMatch = str.match(/[?&][a-zA-Z0-9_-]+=[a-zA-Z0-9+/]{32,}[=]{0,2}/);
      if (dataInUrlMatch && (str.includes('http') || str.includes('wss'))) {
          findings.push({
             id: 'network-egress-data-in-url',
             severity: 'HIGH',
             description: `Potential data exfiltration via URL query parameter: ${dataInUrlMatch[0]}`,
             fixRecommendation: 'Avoid transmitting large amounts of data in URL query parameters. Use POST request bodies with encryption.'
          });
      }
  };

  // Check server configuration and args
  if (server.args) {
    for (const arg of server.args) {
      if (typeof arg !== 'string') continue;
      checkString(arg);
    }
  }

  const serverStr = JSON.stringify(server).toLowerCase();
  
  // child_process + curl/wget/fetch bypass
  if (serverStr.includes('child_process') && (serverStr.includes('exec') || serverStr.includes('spawn')) && 
      (serverStr.includes('curl') || serverStr.includes('wget'))) {
      findings.push({
          id: 'network-egress-bypass-attempt',
          severity: 'HIGH',
          description: `Server uses child_process with curl/wget, which can bypass network restrictions and policy controls.`
      });
  }

  // To simulate source code static analysis, check the entire JSON
  checkString(JSON.stringify(server));

  // Non-standard port detection
  const wssRegex = /wss?:\/\/[^\s"']+/g;
  const wssMatches = serverStr.match(wssRegex);
  if (wssMatches) {
      wssMatches.forEach(w => endpoints.add(w));
  }

  if (/(https?|wss?):\/\/[a-zA-Z0-9.-]+:[0-9]{4,5}/.test(JSON.stringify(server))) {
     // Ignore localhost ports
     const isLocalhostPort = /localhost:[0-9]+/.test(JSON.stringify(server)) || /127\.0\.0\.1:[0-9]+/.test(JSON.stringify(server));
     if (!isLocalhostPort) {
         findings.push({
            id: 'network-egress-non-standard-port',
            severity: 'MEDIUM',
            description: `Server connects to external non-standard ports (e.g., above 1024).`
         });
     }
  }

  for (const endpoint of endpoints) {
     if (endpoint.startsWith('obfuscated:')) {
        findings.push({
           id: 'network-egress-obfuscated',
           severity: 'HIGH',
           description: `Server contains obfuscated URLs (${endpoint.split(':')[1]}).`,
           fixRecommendation: 'Remove obfuscated network endpoints. Use clear configuration.'
        });
        continue;
     }

     if (/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/.test(endpoint)) {
        findings.push({
           id: 'network-egress-raw-ip',
           severity: 'HIGH',
           description: `Server connects directly to raw external IP address: ${endpoint}`,
           fixRecommendation: 'Use domain names instead of raw IP addresses to allow for better policy enforcement.'
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
             description: `Server contacts telemetry/analytics endpoints: ${endpoint}`,
             fixRecommendation: 'Review if telemetry collection is necessary and complies with privacy policy.'
         });
     } else if (category === 'suspicious') {
         findings.push({
             id: 'network-egress-suspicious',
             severity: 'HIGH',
             description: `Server contacts known suspicious or exfiltration endpoints: ${endpoint}`,
             fixRecommendation: 'Immediately audit this server for potential malicious activity.'
         });
     } else if (category === 'api') {
         findings.push({
             id: 'network-egress-api',
             severity: 'INFO',
             description: `Server contacts known API endpoint: ${endpoint}`
         });
     } else if (category === 'cdn') {
         findings.push({
             id: 'network-egress-cdn',
             severity: 'INFO',
             description: `Server loads resources from CDN: ${endpoint}`
         });
     } else if (category === 'unknown' && !endpoint.includes('localhost') && !endpoint.includes('127.0.0.1')) {
         findings.push({
             id: 'network-egress-unknown',
             severity: 'MEDIUM',
             description: `Server contacts unknown external endpoint: ${endpoint}`
         });
     }
  }

  // Deduplicate findings
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
