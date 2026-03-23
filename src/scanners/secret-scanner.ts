import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { SECRET_PATTERNS } from '../data/secret-patterns.js';

export function scanSecrets(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  if (!server.env) return findings;

  for (const [key, value] of Object.entries(server.env)) {
    // 1. Check for environment variable references (e.g., ${VAR} or $VAR)
    const envRefMatch = value.match(/^\$\{([A-Z0-9_]+)\}$|^\$([A-Z0-9_]+)$/);
    if (envRefMatch) {
      const varName = envRefMatch[1] || envRefMatch[2];
      if (!(varName in process.env)) {
        findings.push({
          id: 'missing-referenced-env-var',
          severity: 'MEDIUM',
          description: `Environment variable reference '${varName}' found in '${key}', but it is not set in the system.`,
          fixRecommendation: `Ensure '${varName}' is set in your environment before running the AI tool.`,
        });
      }
      // If it's a reference, don't check for secret patterns
      continue;
    }

    // 2. Check for hardcoded secret patterns
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(value)) {
        findings.push({
          id: 'exposed-secret',
          severity: 'CRITICAL',
          description: `Exposed ${pattern.name} in environment variable '${key}'.`,
          fixRecommendation: `Move the secret to a secure environment variable and reference it instead (e.g., \${${key}}).`,
          fixable: true
        });
        break; // Stop after first match for this value
      }
    }
  }

  return findings;
}
