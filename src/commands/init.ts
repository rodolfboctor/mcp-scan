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
    ignoreServers: [],
    ignoreRules: [],
    customBlocklist: []
  };

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  logger.pass(`Created .mcp-scan.json configuration file.`);
}
