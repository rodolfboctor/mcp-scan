import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { SECRET_PATTERNS } from '../data/secret-patterns.js';

export function scanSecrets(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  if (!server.env) return findings;

  for (const [key, value] of Object.entries(server.env)) {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(value)) {
        findings.push({
          id: 'exposed-secret',
          severity: 'CRITICAL',
          description: `Exposed ${pattern.name} in environment variable '${key}'.`,
          fixRecommendation: `Move the secret to a secure environment variable and reference it instead (e.g. process.env.${key}).`,
          fixable: true
        });
        break; // Stop after first match for this value
      }
    }
  }

  return findings;
}
