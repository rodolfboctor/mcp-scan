import fs from 'fs';
import path from 'path';
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

  logger.info(`Watching ${validPaths.length} configuration files for changes...`);

  // Initial scan
  await runScan({ silent: false });

  let debounceTimeout: NodeJS.Timeout;
  const watchedDirs = new Set<string>();

  for (const configPath of validPaths) {
    const dir = path.dirname(configPath);
    if (watchedDirs.has(dir)) continue;
    watchedDirs.add(dir);

    try {
      fs.watch(dir, (eventType, filename) => {
        // filename is the name of the file within the directory
        const changedPath = filename ? path.join(dir, filename) : null;
        
        // Only trigger if the changed file is one of our config files
        if (changedPath && validPaths.includes(changedPath)) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(async () => {
            logger.divider();
            logger.brand(`Change detected in ${changedPath}, rescanning...`);
            await runScan({ silent: true });
          }, 500);
        }
      });
    } catch (error: any) {
      logger.error(`Failed to watch directory ${dir}: ${error.message}`);
    }
  }
  
  // Keep the process alive
  process.stdin.resume();
  
  process.on('SIGINT', () => {
    logger.info('Stopping watch mode.');
    process.exit(0);
  });
}
