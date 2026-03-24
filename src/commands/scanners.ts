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
    let description = 'A security scanner.';
    // Add specific descriptions for known scanners
    if (file === 'env-leak-scanner.js') {
      description = 'Scans .env files for exposed secrets.';
    } else if (file === 'prompt-injection-scanner.js') {
      description = 'Scans for prompt injection vulnerabilities.';
    } else if (file === 'secret-scanner.js') {
      description = 'Scans config values for exposed secrets.';
    } else if (file === 'permission-scanner.js') {
      description = 'Scans for excessive filesystem permissions.';
    } else if (file === 'registry-scanner.js') {
      description = 'Checks npm package against known malicious lists.';
    } else if (file === 'typosquat-scanner.js') {
      description = 'Detects typosquatting of npm packages.';
    } else if (file === 'transport-scanner.js') {
      description = 'Checks transport protocols and authentication.';
    } else if (file === 'config-scanner.js') {
      description = 'Checks for shell injection and argument list issues.';
    } else if (file === 'ast-scanner.js') {
      description = 'Performs Abstract Syntax Tree analysis on config files.';
    } else if (file === 'package-scanner.js') {
      description = 'Performs deep package audits including OSV.dev lookup.';
    }

    table.push([file, description]);
  }

  logger.log(table.toString());
  logger.brand(`Total scanners available: ${scannerFiles.length}`);
}
