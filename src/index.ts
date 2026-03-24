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
import { runProxy } from './commands/proxy.js';

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
  .option('--html <path>', 'Output report in self-contained HTML format')
  .option('--sbom <path>', 'Output Software Bill of Materials (SBOM) in CycloneDX format')
  .option('--webhook <url>', 'POST scan results to a webhook URL')
  .option('--slack-webhook <url>', 'POST scan results to a Slack webhook URL')
  .option('--offline', 'Skip all external network calls and use bundled CVE snapshot')
  .addHelpText('after', `
Examples:
  $ mcp-scan
  $ mcp-scan --severity high
  $ mcp-scan --offline
  $ mcp-scan --config ~/.cursor/mcp.json
  $ mcp-scan --json > report.json
  $ mcp-scan --html report.html
  $ mcp-scan --sarif results.sarif
  $ mcp-scan --sbom sbom.json
  $ mcp-scan --webhook https://example.com/webhook
  $ mcp-scan --slack-webhook https://hooks.slack.com/services/...
  $ mcp-scan --fix
  `)
  .action(async (options) => {
    if (options.ci) {
      options.json = true; // Force JSON output in CI mode
      chalk.level = 0; // Disable chalk colors in CI mode
    }
    const report = await runScan({ ...options, version: pkg.version, ci: options.ci });

    if (options.sarif) {
      const { writeSarifReport } = await import('./utils/sarif-reporter.js');
      writeSarifReport(report, options.sarif);
    }

    if (options.html) {
      const { generateHtmlReport } = await import('./utils/html-reporter.js');
      const { writeFileSync } = await import('fs');
      const htmlContent = generateHtmlReport(report);
      writeFileSync(options.html, htmlContent);
      if (!options.silent && !options.json) {
        const { logger } = await import('./utils/logger.js');
        logger.pass(`HTML report generated: ${options.html}`);
      }
    }

    if (options.sbom) {
      const { generateSbom } = await import('./utils/sbom-generator.js');
      const { writeFileSync } = await import('fs');
      const sbomContent = await generateSbom(report);
      writeFileSync(options.sbom, JSON.stringify(sbomContent, null, 2));
      if (!options.silent && !options.json) {
        const { logger } = await import('./utils/logger.js');
        logger.pass(`SBOM generated: ${options.sbom}`);
      }
    }

    if (options.webhook) {
      const { sendWebhook } = await import('./utils/webhook.js');
      await sendWebhook(options.webhook, report);
    }

    if (options.slackWebhook) {
      const { sendSlackWebhook } = await import('./utils/webhook.js');
      await sendSlackWebhook(options.slackWebhook, report);
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
  .command('diff <oldReport> <newReport>')
  .description('Compare two scan reports and show changes')
  .action(async (oldPath, newPath) => {
    const { runDiff } = await import('./commands/diff.js');
    await runDiff(oldPath, newPath);
  });

program
  .command('audit [server]')
  .description('View scan history or deep audit a specific server')
  .action(async (server) => {
    await runAudit(server);
  });

program
  .command('fix')
  .description('Interactive auto-fix for exposed secrets and permissions')
  .action(async () => {
    await runFix();
  });

program
  .command('watch')
  .description('Continuous monitoring of config files')
  .option('--webhook <url>', 'POST new findings to a webhook URL')
  .option('--slack-webhook <url>', 'POST new findings to a Slack webhook URL')
  .action(async (options) => {
    await runWatch(options);
  });

program
  .command('history')
  .description('Show scan history trends and common findings')
  .action(async () => {
    const { showHistoryTrends } = await import('./commands/history.js');
    await showHistoryTrends();
  });

program
  .command('doctor')
  .description('Run system diagnostic check for mcp-scan')
  .action(async () => {
    const { runDoctor } = await import('./commands/doctor.js');
    await runDoctor();
  });

program
  .command('ls')
  .description('List all detected MCP servers')
  .action(async () => {
    await runLs();
  });

program
  .command('init')
  .description('Create .mcp-scan.json config in current directory')
  .action(async () => {
    await runInit();
  });

program
  .command('scanners')
  .description('List all available security scanners')
  .action(() => {
    listScanners();
  });

program
  .command('ci')
  .description('CI mode (JSON output, strict exit codes)')
  .option('--max-severity <level>', 'Maximum allowed severity before failing', 'high')
  .option('--output <path>', 'Path to save JSON output')
  .action(async (options) => {
    await runCi(options);
  });

program
  .command('submit')
  .description('Scan and submit clean servers to ugig.net MCP marketplace')
  .option('--ugig-key <key>', 'ugig.net API key')
  .option('--dry-run', 'Preview what would be submitted')
  .action(async (options) => {
    const report = await runScan({ ...options, version: pkg.version, silent: false });
    const apiKey = options.ugigKey || process.env.UGIG_API_KEY;
    await submitToUgig(report, { apiKey, dryRun: options.dryRun });
  });

program
  .command('proxy')
  .description('Run a runtime security proxy for an MCP server')
  .option('-c, --command <cmd>', 'Command to run the MCP server')
  .option('-a, --args <args>', 'Arguments for the MCP server (comma separated or quoted)')
  .action(async (options) => {
    await runProxy(options);
  });

program.parse();
