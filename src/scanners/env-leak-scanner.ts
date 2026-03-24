import fs from 'fs';
import path from 'path';
import { ResolvedServer } from '../types/config.js';
import { Finding, FindingId } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';

// Regex to detect keys that commonly represent secrets
const SECRET_KEY_REGEX = /.*(KEY|SECRET|TOKEN|PASSWORD|API_|AUTH_).*/i;

export function scanEnvLeak(server: ResolvedServer, serverFilePath: string): Finding[] {
  const findings: Finding[] = [];
  const serverDir = path.dirname(serverFilePath);

  // Look for .env files in parent directories up to the project root
  let currentDir = serverDir;
  while (currentDir !== path.parse(currentDir).root) {
    const envPath = path.join(currentDir, '.env');
    if (fs.existsSync(envPath)) {
      if (logger.isVerbose) logger.detail(`Found .env file at: ${envPath}`);
      
      try {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('#')) continue; // Skip empty lines and comments

          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=').trim();

          if (!key) continue;

          // Check if the key matches secret patterns and value is long enough
          if (SECRET_KEY_REGEX.test(key) && value.length > 20) {
            // Skip values containing common placeholders
            if (value.includes('YOUR_') || value.includes('REPLACE') || value.includes('EXAMPLE') || value.includes('PLACEHOLDER')) {
              continue;
            }

            findings.push({
              id: 'env-secret-exposed' as FindingId, // Use a new FindingId
              severity: 'HIGH',
              description: `Potentially exposed secret in '.env' file: Key '${key}' has a long value.`,
              fixRecommendation: `Review the value for key '${key}' in the .env file. If it's a sensitive secret, ensure it's properly secured and not committed to version control. Consider using a secrets manager.`,
            });
          }
        }
      } catch (error) {
        logger.warn(`Failed to read or parse .env file at ${envPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
      // We've found an .env file, no need to check further up the directory tree
      break; 
    }
    currentDir = path.dirname(currentDir);
  }

  return findings;
}
