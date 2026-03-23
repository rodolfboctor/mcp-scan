import Table from 'cli-table3';
import { logger } from '../utils/logger.js';
import { readdirSync } from 'fs';
import path from 'path';

export function listScanners() {
  const scannersPath = path.join(__dirname, '../scanners');
  const scannerFiles = readdirSync(scannersPath).filter(file => file.endsWith('.js'));

  const table = new Table({
    head: ['Scanner File', 'Description'],
    style: { head: ['cyan'] }
  });

  for (const file of scannerFiles) {
    // A real implementation might read JSDoc comments for descriptions
    table.push([file, 'A security scanner.']);
  }

  logger.log(table.toString());
  logger.brand(`Total scanners available: ${scannerFiles.length}`);
}
