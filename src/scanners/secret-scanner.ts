import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { SECRET_PATTERNS } from '../data/secret-patterns.js';

/**
 * Calculates the Shannon entropy of a string.
 * @param str The string to calculate entropy for.
 * @returns The entropy in bits per character.
 */
function calculateEntropy(str: string): number {
  if (!str) return 0;
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Checks if a string looks like a UUID or other common high-entropy non-secrets.
 */
function isExemptFromEntropy(str: string): boolean {
  // UUID pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return true;
  
  // Base64 padded short strings often have high entropy but might not be secrets
  // We already have a length check (20+), so this is less of an issue.
  
  return false;
}

export function scanSecrets(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  const scanValue = (value: string, source: string, key?: string) => {
    // 1. Check for environment variable references (e.g., ${VAR} or $VAR or %VAR%)
    const windowsEnvRef = value.match(/^%([A-Z0-9_]+)%$/);
    if (windowsEnvRef) {
      const varName = windowsEnvRef[1];
      if (!(varName in process.env)) {
        findings.push({
          id: 'missing-referenced-env-var',
          severity: 'MEDIUM',
          description: `Windows-style environment variable reference '%${varName}%' found in ${source}${key ? ` '${key}'` : ''}, but it is not set in the system.`,
          fixRecommendation: `Ensure '${varName}' is set in your environment before running the AI tool.`,
        });
      }
      return;
    }

    const envRefMatch = value.match(/^\$\{([A-Z0-9_]+)\}$|^\$([A-Z0-9_]+)$/);
    if (envRefMatch) {
      const varName = envRefMatch[1] || envRefMatch[2];
      if (!(varName in process.env)) {
        findings.push({
          id: 'missing-referenced-env-var',
          severity: 'MEDIUM',
          description: `Environment variable reference '${varName}' found in ${source}${key ? ` '${key}'` : ''}, but it is not set in the system.`,
          fixRecommendation: `Ensure '${varName}' is set in your environment before running the AI tool.`,
        });
      }
      return;
    }

    // 2. Check for hardcoded secret patterns
    let foundPattern = false;
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(value)) {
        findings.push({
          id: 'exposed-secret',
          severity: 'CRITICAL',
          description: `Exposed ${pattern.name} in ${source}${key ? ` '${key}'` : ''}.`,
          fixRecommendation: `Move the secret to a secure environment variable and reference it instead (e.g., \${${key || 'VAR_NAME'}}).`,
          fixable: true,
          remediationConfidence: 99
        });
        foundPattern = true;
        break; 
      }
    }

    // 3. Entropy-based detection (if no pattern matched)
    if (!foundPattern && value.length >= 20) {
      const entropy = calculateEntropy(value);
      if (entropy > 4.5 && !isExemptFromEntropy(value)) {
        findings.push({
          id: 'high-entropy-value',
          severity: 'MEDIUM',
          description: `High-entropy string (${entropy.toFixed(2)} bits/char) detected in ${source}${key ? ` '${key}'` : ''}. This might be an undocumented secret.`,
          fixRecommendation: 'Check whether this value is a sensitive credential. If so, move it to an environment variable.'
        });
      }
    }
  };

  // Scan environment variables
  if (server.env) {
    for (const [key, value] of Object.entries(server.env)) {
      scanValue(value, 'environment variable', key);
    }
  }

  // Scan arguments
  if (server.args) {
    const argsArray = Array.isArray(server.args) ? server.args : Object.values(server.args);
    for (const arg of argsArray) {
      if (typeof arg === 'string') {
        scanValue(arg, 'argument');
      }
    }
  }

  return findings;
}
