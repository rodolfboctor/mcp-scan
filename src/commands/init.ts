import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function runInit() {
  const configPath = path.join(process.cwd(), '.mcp-scan.json');
  
  if (fs.existsSync(configPath)) {
    logger.warn(`.mcp-scan.json already exists in current directory.`);
    return;
  }

  const defaultConfig = {
    "allowedPackages": [],
    "blockedPackages": [],
    "allowedDomains": ["localhost", "127.0.0.1"],
    "requiredEnvVarPrefix": "",
    "maxSeverity": "low",
    "suppressRules": [],
    "ignorePaths": [],
    "policyFile": ".mcp-scan-policy.yml",
    "reportFormat": "text"
  };

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  logger.pass(`Created .mcp-scan.json security policy template.`);
}
