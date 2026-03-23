import { Command } from 'commander';
import { readFileSync } from 'fs';

import { runScan } from './commands/scan.js';
import { runAudit } from './commands/audit.js';
import { runFix } from './commands/fix.js';
import { runWatch } from './commands/watch.js';
import { runLs } from './commands/ls.js';
import { runInit } from './commands/init.js';
import { runCi } from './commands/ci.js';
import { listScanners } from './commands/scanners.js';

const pkgUrl = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8'));

const program = new Command();

program
  .name('mcp-scan')
  .description('Security scanner for MCP servers.')
  .version(pkg.version);

program
  .command('scan', { isDefault: true })
  .description('Full security scan of all detected AI tool configs')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--json', 'Output report in JSON format')
  .option('--fix', 'Automatically fix issues')
  .option('--severity <level>', 'Filter by severity (low, medium, high, critical)', 'low')
  .option('-c, --config <path>', 'Path to a specific MCP config file to scan')
  .option('--ugig', 'Show ugig.net marketplace link for verified servers')
  .action(async (options) => {
    const report = await runScan({ ...options, version: pkg.version });
    if (report.criticalCount > 0 || report.highCount > 0) {
      process.exit(1);
    }
  });

program
  .command('audit <server>')
  .description('Deep audit of a specific server')
  .action(runAudit);

program
  .command('fix')
  .description('Interactive auto-fix for exposed secrets and permissions')
  .action(runFix);

program
  .command('watch')
  .description('Continuous monitoring of config files')
  .action(runWatch);

program
  .command('ls')
  .description('List all detected MCP servers')
  .action(runLs);

program
  .command('init')
  .description('Create .mcp-scan.json config in current directory')
  .action(runInit);

program
  .command('scanners')
  .description('List all available security scanners')
  .action(listScanners);

program
  .command('ci')
  .description('CI mode (JSON output, strict exit codes)')
  .option('--max-severity <level>', 'Maximum allowed severity (critical, high, medium, low)', 'high')
  .action(runCi);

program.parse();
