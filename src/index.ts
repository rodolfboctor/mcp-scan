import { Command } from 'commander';
import { readFileSync } from 'fs';
import chalk from 'chalk';

import { runScan } from './commands/scan.js';
import { runAudit } from './commands/audit.js';
import { runFix } from './commands/fix.js';
import { runWatch } from './commands/watch.js';
import { runLs } from './commands/ls.js';
import { runInit } from './commands/init.js';
import { runCi } from './commands/ci.js';
import { listScanners } from './commands/scanners.js';
import { submitToUgig } from './commands/submit.js';
import { writeSarifReport } from './utils/sarif-reporter.js';

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
  .option('--submit', 'Submit clean servers to ugig.net MCP marketplace after scan')
  .option('--ugig-key <key>', 'ugig.net API key for --submit (or set UGIG_API_KEY env var)')
  .option('--dry-run', 'Preview what would be submitted without sending (use with --submit)')
  .option('--ci', 'Enable CI mode (JSON output, strict exit codes)')
  .option('--sarif <path>', 'Output report in SARIF format for GitHub Security Scanning')
  .addHelpText('after', `
Examples:
  $ mcp-scan
  $ mcp-scan --severity high
  $ mcp-scan --config ~/.cursor/mcp.json
  $ mcp-scan --json > report.json
  $ mcp-scan --sarif results.sarif
  $ mcp-scan --fix
  `)
  .action(async (options) => {
    if (options.ci) {
      options.json = true; // Force JSON output in CI mode
      chalk.level = 0; // Disable chalk colors in CI mode
    }
    const report = await runScan({ ...options, version: pkg.version, ci: options.ci });

    if (options.sarif) {
      writeSarifReport(report, options.sarif);
    }

    if (report.criticalCount > 0 || report.highCount > 0) {
      process.exitCode = 1;
    }
    if (options.submit) {
      const apiKey = options.ugigKey || process.env.UGIG_API_KEY;
      await submitToUgig(report, { apiKey, dryRun: options.dryRun });
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

program
  .command('submit')
  .description('Scan and submit clean servers to ugig.net MCP marketplace')
  .option('-c, --config <path>', 'Path to a specific MCP config file')
  .option('--ugig-key <key>', 'ugig.net API key (or set UGIG_API_KEY env var)')
  .option('--dry-run', 'Preview submissions without sending')
  .option('--severity <level>', 'Minimum severity to report', 'low')
  .action(async (options) => {
    const report = await runScan({ ...options, version: pkg.version, silent: false });
    const apiKey = options.ugigKey || process.env.UGIG_API_KEY;
    await submitToUgig(report, { apiKey, dryRun: options.dryRun });
  });

program.parse();
