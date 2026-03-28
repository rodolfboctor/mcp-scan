import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { PII_PATTERNS } from '../data/pii-patterns.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function scanDataControls(server: ResolvedServer, performRetentionScan: boolean = false): Finding[] {
  const findings: Finding[] = [];
  const serverStr = JSON.stringify(server).toLowerCase();
  
  const detectedPii = new Set<string>();
  
  for (const pattern of PII_PATTERNS) {
      if (pattern.regex.test(JSON.stringify(server))) {
          detectedPii.add(pattern.name);
      }
  }
  
  const piiTerms = {
      'Email': ['email', 'e-mail'],
      'Phone Number': ['phone number', 'telephone', 'mobile number'],
      'Credit Card': ['credit card', 'ccnum', 'card number', 'stripe_key'],
      'SSN': ['ssn', 'social security'],
      'IPv4 Address': ['ipv4', 'client ip']
  };
  
  for (const [name, terms] of Object.entries(piiTerms)) {
      if (terms.some(t => serverStr.includes(t))) {
          detectedPii.add(name);
      }
  }

  if (detectedPii.size > 0) {
      const piiList = Array.from(detectedPii).join(', ');
      findings.push({
         id: 'data-controls-pii',
         severity: detectedPii.has('Credit Card') || detectedPii.has('SSN') ? 'CRITICAL' : 'HIGH',
         description: `Server handles PII: ${piiList}`,
         fixRecommendation: 'Ensure proper consent and minimization for PII data.'
      });
      
      if (!serverStr.includes('consent') && !serverStr.includes('opt-in') && !serverStr.includes('agree')) {
         findings.push({
            id: 'data-controls-consent-gap',
            severity: 'MEDIUM',
            description: `Server handles PII but no consent mechanism is detected.`,
            fixRecommendation: 'Implement explicit user consent for PII processing.'
         });
      }
  }
  
  // Only flag retention/deletion/encryption gaps when PII is actually present.
  // Without PII, these checks produce false positives on every server.
  if (detectedPii.size > 0) {
    const hasRetention = serverStr.includes('ttl') || serverStr.includes('expire') || serverStr.includes('cleanup') || serverStr.includes('retention');
    if (!hasRetention) {
       findings.push({
          id: 'data-controls-retention-gap',
          severity: 'MEDIUM',
          description: `Server handles PII but no data retention policy or cleanup mechanism detected.`,
          fixRecommendation: 'Implement data retention policies (e.g., TTL, auto-cleanup).'
       });
    }

    const hasDeletion = serverStr.includes('delete') || serverStr.includes('remove') || serverStr.includes('forget') || serverStr.includes('destroy');
    if (!hasDeletion) {
       findings.push({
          id: 'data-controls-deletion-gap',
          severity: 'MEDIUM',
          description: `Server handles PII but no user data deletion capability detected.`,
          fixRecommendation: 'Add an endpoint or tool to allow user data deletion.'
       });
    }

    const hasEncryption = serverStr.includes('encrypt') || serverStr.includes('aes') || serverStr.includes('kms') || serverStr.includes('crypto');
    if (!hasEncryption) {
       findings.push({
          id: 'data-controls-encryption-gap',
          severity: 'MEDIUM',
          description: `Server handles PII but no encryption at rest detected for stored data.`,
          fixRecommendation: 'Encrypt sensitive data before storing it.'
       });
    }
  }
  
  if (serverStr.includes('log') && (serverStr.includes('prompt') || serverStr.includes('query') || serverStr.includes('interaction'))) {
     findings.push({
        id: 'data-controls-prompt-logging',
        severity: 'MEDIUM',
        description: `Server appears to log user prompts/queries.`,
        fixRecommendation: 'Anonymize or disable prompt logging to protect user privacy.'
     });
  }

  if (serverStr.includes('http') || serverStr.includes('api.')) {
     findings.push({
        id: 'data-controls-sharing',
        severity: 'LOW',
        description: `Server may share data with third-party endpoints.`,
        fixRecommendation: 'Document all third-party data sharing in a privacy policy.'
     });
  }

  if (performRetentionScan) {
      const tmpPaths = [os.tmpdir(), '/tmp'];
      let foundOld = false;
      for (const t of tmpPaths) {
          try {
              if (fs.existsSync(t)) {
                  foundOld = true;
                  break;
              }
          } catch(e) {}
      }
      if (foundOld) {
          findings.push({
              id: 'data-controls-old-temp-files',
              severity: 'MEDIUM',
              description: `Found potentially old temp files that lack garbage collection.`,
              fixRecommendation: 'Run a cleanup script or implement automatic rotation.'
          });
      }
  }

  return findings;
}