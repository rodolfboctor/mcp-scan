import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { runScan } from './commands/scan.js';
import { runAudit } from './commands/audit.js';
import { runFix } from './commands/fix.js';
import { runWatch } from './commands/watch.js';
import { runLs } from './commands/ls.js';
import { runInit } from './commands/init.js';
import { runCi } from './commands/ci.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgPath = join(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const program = new Command();

program
  .name('mcp-scan')
  .description('Security scanner for MCP servers.')
  .version(pkg.version);

program
  .command('scan', { isDefault: true })
  .description('Full security scan of all detected AI tool configs')
  .action(async () => {
    const report = await runScan();
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
  .command('ci')
  .description('CI mode (JSON output, strict exit codes)')
  .option('--max-severity <level>', 'Maximum allowed severity (critical, high, medium, low)', 'high')
  .action(runCi);

program.parse();
