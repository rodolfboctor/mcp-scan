import fs from 'fs';
import { runScan } from './scan.js';
import { logger } from '../utils/logger.js';
import { detectTools } from '../config/detector.js';

export async function runWatch() {
  logger.brand('Starting watch mode...');
  
  const tools = detectTools();
  const validPaths = tools.filter(t => t.exists).map(t => t.configPath);

  if (validPaths.length === 0) {
    logger.error('No config files found to watch.');
    process.exit(1);
  }

  logger.info(`Watching ${validPaths.length} configuration files...`);

  // Initial scan
  await runScan({ silent: false });

  let timeout: NodeJS.Timeout;

  for (const configPath of validPaths) {
    fs.watch(configPath, (eventType) => {
      if (eventType === 'change') {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          logger.divider();
          logger.brand(`Change detected in ${configPath}, rescanning...`);
          await runScan({ silent: true });
        }, 500); // Debounce
      }
    });
  }
}
