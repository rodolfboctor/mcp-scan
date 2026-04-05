import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { PII_PATTERNS } from '../data/pii-patterns.js';
import fs from 'fs';
import os from 'os';

/**
 * Scanner for data controls, privacy, and PII handling.
 * Evaluates if a server follows best practices for data retention, encryption, and consent.
 */
export function scanDataControls(server: ResolvedServer, performRetentionScan: boolean = false): Finding[] {
  const findings: Finding[] = [];
  const serverStr = JSON.stringify(server).toLowerCase();
  
  const detectedPii = new Set<string>();
  
  // 1. Pattern-based PII detection
  for (const pattern of PII_PATTERNS) {
      if (pattern.regex.test(JSON.stringify(server))) {
          detectedPii.add(pattern.name);
      }
  }
  
  // 2. Keyword-based PII detection
  const piiTerms: Record<string, string[]> = {
      'Email': ['email', 'e-mail'],
      'Phone Number': ['phone number', 'telephone', 'mobile number', 'cell phone'],
      'Credit Card': ['credit card', 'ccnum', 'card number', 'cvv', 'expiry'],
      'SSN': ['ssn', 'social security', 'tax id', 'national id'],
      'IPv4 Address': ['ipv4', 'client ip', 'ip address'],
      'Password': ['password', 'pwd', 'passphrase', 'pin code'],
      'API Key': ['api_key', 'apikey', 'secret_key', 'token'],
      'Address': ['street address', 'residential address', 'home address', 'mailing address'],
      'Date of Birth': ['date of birth', 'dob', 'birthday', 'birth date'],
      'Health Data': ['diagnosis', 'medical record', 'prescription', 'health data', 'phi', 'hipaa'],
      'Biometric': ['fingerprint', 'face id', 'biometric', 'retina scan'],
      'PII': ['pii', 'personal data', 'personally identifiable']
  };
  
  for (const [name, terms] of Object.entries(piiTerms)) {
      if (terms.some(t => serverStr.includes(t))) {
          detectedPii.add(name);
      }
  }

  if (detectedPii.size > 0) {
      const piiList = Array.from(detectedPii).join(', ');
      const isHighRisk = detectedPii.has('Credit Card') || detectedPii.has('SSN') || 
                         detectedPii.has('Password') || detectedPii.has('API Key');

      findings.push({
         id: 'data-controls-pii',
         severity: isHighRisk ? 'CRITICAL' : 'HIGH',
         description: `Server handles PII/Sensitive data: ${piiList}`,
         fixRecommendation: 'Implement strict data minimization. Ensure all PII is encrypted and handled according to privacy policies.'
      });
      
      // Consent Check
      const hasConsentKeywords = /consent|opt-in|agree|policy|permission/i.test(serverStr);
      if (!hasConsentKeywords) {
         findings.push({
            id: 'data-controls-consent-gap',
            severity: 'MEDIUM',
            description: `Server handles PII but no consent mechanism or privacy policy reference detected.`,
            fixRecommendation: 'Implement explicit user consent for PII processing and link to a privacy policy.'
         });
      }

      // Retention Check
      const hasRetention = /ttl|expire|cleanup|retention|auto-delete|purge/i.test(serverStr);
      if (!hasRetention) {
         findings.push({
            id: 'data-controls-retention-gap',
            severity: 'MEDIUM',
            description: `Server handles PII but no data retention policy or auto-cleanup detected.`,
            fixRecommendation: 'Implement data retention policies (e.g., TTL, automatic cleanup of old records).'
         });
      }

      // Deletion Check
      const hasDeletion = /delete|remove|forget|destroy|wipe|unlink/i.test(serverStr);
      if (!hasDeletion) {
         findings.push({
            id: 'data-controls-deletion-gap',
            severity: 'MEDIUM',
            description: `Server handles PII but no user-initiated data deletion capability detected.`,
            fixRecommendation: 'Provide a tool or endpoint that allows users to request the deletion of their personal data.'
         });
      }

      // Encryption Check
      const hasEncryption = /encrypt|aes|kms|crypto|vault|sealed/i.test(serverStr);
      if (!hasEncryption) {
         findings.push({
            id: 'data-controls-encryption-gap',
            severity: 'HIGH',
            description: `Server handles PII but no encryption at rest detected for stored data.`,
            fixRecommendation: 'Encrypt sensitive data at rest using strong cryptographic standards (e.g., AES-256).'
         });
      }

      // Data Minimization Check (Heuristic)
      // If a tool has many properties (>10) and handles PII, it might be over-collecting.
      const tools = server.schema?.tools || [];
      for (const tool of tools) {
          const props = tool.inputSchema?.properties ? Object.keys(tool.inputSchema.properties) : [];
          if (props.length > 10 && JSON.stringify(tool).toLowerCase().includes('pii')) {
              findings.push({
                  id: 'data-controls-minimization-risk',
                  severity: 'LOW',
                  description: `Tool '${tool.name}' requests a large number of properties and handles PII.`,
                  fixRecommendation: 'Audit tool properties and remove any that are not strictly necessary for the intended function.'
              });
          }
      }
  }
  
  // Prompt Logging Check
  const isLoggingPrompts = /log/i.test(serverStr) && /(prompt|query|interaction|message|chat)/i.test(serverStr);
  if (isLoggingPrompts) {
     findings.push({
        id: 'data-controls-prompt-logging',
        severity: 'MEDIUM',
        description: `Server appears to log raw user prompts or interactions.`,
        fixRecommendation: 'Anonymize logs, remove PII before logging, or provide a way to disable prompt logging.'
     });
  }

  // Retention Scan (Optional disk check)
  if (performRetentionScan) {
      const tmpPaths = [os.tmpdir(), '/tmp'];
      let foundTempFiles = false;
      for (const t of tmpPaths) {
          try {
              if (fs.existsSync(t)) {
                  const files = fs.readdirSync(t);
                  if (files.length > 100) { // Arbitrary threshold for "many temp files"
                      foundTempFiles = true;
                      break;
                  }
              }
          } catch(e) {}
      }
      if (foundTempFiles) {
          findings.push({
              id: 'data-controls-stale-temp-files',
              severity: 'LOW',
              description: `System contains a large number of temporary files, which may indicate a lack of proper cleanup.`,
              fixRecommendation: 'Verify that temporary files created by the server are properly cleaned up after use.'
          });
      }
  }

  return findings;
}
