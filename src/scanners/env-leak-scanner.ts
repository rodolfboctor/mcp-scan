import fs from 'fs';
import path from 'path';
import { ResolvedServer } from '../types/config.js';
import { Finding, FindingId } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';

// Regex to detect keys that commonly represent secrets
const SECRET_KEY_REGEX = /.*(KEY|SECRET|TOKEN|PASSWORD|API_|AUTH_|CREDENTIAL|BEARER|CERT|PEM|PASSPHRASE|SIGNING).*/i;

// Additional .env file variants to check
const ENV_FILE_NAMES = ['.env', '.env.local', '.env.production', '.env.development', '.env.staging'];

export function scanEnvLeak(server: ResolvedServer, serverFilePath: string): Finding[] {
  const findings: Finding[] = [];
  const serverDir = path.dirname(serverFilePath);

  // Look for .env files in parent directories up to the project root
  let currentDir = serverDir;
  while (currentDir !== path.parse(currentDir).root) {
    let foundEnvInDir = false;
    for (const envFileName of ENV_FILE_NAMES) {
      const envPath = path.join(currentDir, envFileName);
      if (!fs.existsSync(envPath)) continue;
      foundEnvInDir = true;
      if (logger.isVerbose) logger.detail(`Found env file at: ${envPath}`);

      try {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('#')) continue;

          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');

          if (!key) continue;

          if (SECRET_KEY_REGEX.test(key) && value.length > 20) {
            if (value.includes('YOUR_') || value.includes('REPLACE') || value.includes('EXAMPLE') || value.includes('PLACEHOLDER') || value.includes('changeme')) {
              continue;
            }

            findings.push({
              id: 'env-secret-exposed' as FindingId,
              severity: 'HIGH',
              description: `Potentially exposed secret in '${envFileName}': key '${key}' has a real-looking value.`,
              fixRecommendation: `Review key '${key}' in ${envFileName}. If it's a real secret, ensure the file is in .gitignore and consider using a secrets manager.`,
            });
          }
        }
      } catch (error) {
        logger.warn(`Failed to read ${envPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    // Stop climbing once we find a directory with env files
    if (foundEnvInDir) break;
    currentDir = path.dirname(currentDir);
  }

  return findings;
}
