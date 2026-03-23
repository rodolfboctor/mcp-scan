import Table from 'cli-table3';
import { ScanReport } from '../types/scan-result.js';
import { logger } from './logger.js';
import { SEVERITY_ORDER } from '../types/severity.js';

import chalk from 'chalk';

const brand = chalk.hex('#339DFF');
const criticalBg = chalk.bgHex('#F85149').white.bold;
const highBg = chalk.bgHex('#F0883E').white.bold;
const mediumBg = chalk.bgHex('#D29922').white.bold;
const lowBg = chalk.bgGray.white;
const infoBg = chalk.bgHex('#339DFF').white;
const passGreen = chalk.hex('#3FB950').bold;
const dim = chalk.dim;

function severityBadge(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return criticalBg(` CRITICAL `);
    case 'HIGH':     return highBg(` HIGH     `);
    case 'MEDIUM':   return mediumBg(` MEDIUM   `);
    case 'LOW':      return lowBg(` LOW      `);
    case 'INFO':     return infoBg(` INFO     `);
    default:         return severity;
  }
}

export function printReport(report: ScanReport) {
  logger.emptyLine();

  // Header banner
  logger.brand('  ┌─────────────────────────────────────────────┐');
  logger.brand('  │  🛡️  mcp-scan  ·  Security Report             │');
  logger.brand('  └─────────────────────────────────────────────┘');
  logger.emptyLine();

  if (report.results.length === 0) {
    logger.info('No MCP servers detected to scan.');
    logger.emptyLine();
    logger.log(dim('  Built by Rodolf · thynkq.com'));
    logger.emptyLine();
    return;
  }

  // Group results: issues first, then clean
  const withFindings = report.results.filter(r => r.findings.length > 0);
  const clean = report.results.filter(r => r.findings.length === 0);

  for (const result of withFindings) {
    const sortedFindings = [...result.findings].sort(
      (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
    );

    logger.log(brand.bold(`  ${result.toolName}`) + chalk.white(` › `) + chalk.bold(result.serverName));
    logger.log(dim(`  ${result.configPath}`));
    logger.emptyLine();

    for (const finding of sortedFindings) {
      logger.log(`  ${severityBadge(finding.severity)}  ${chalk.bold(finding.id)}`);
      logger.log(`           ${finding.description}`);
      if (finding.fixRecommendation) {
        logger.log(dim(`           ↳ ${finding.fixRecommendation}`));
      }
      logger.emptyLine();
    }

    logger.log(dim('  ' + '─'.repeat(60)));
    logger.emptyLine();
  }

  // Clean servers summary
  if (clean.length > 0) {
    for (const result of clean) {
      logger.log(passGreen(`  ✓`) + ` ${result.toolName} › ${result.serverName}`);
    }
    logger.emptyLine();
  }

  // Final summary bar
  const total = report.totalScanned;
  const ms = report.totalDurationMs;
  const parts = [];
  if (report.criticalCount > 0) parts.push(criticalBg(` ${report.criticalCount} critical `));
  if (report.highCount > 0)     parts.push(highBg(` ${report.highCount} high `));
  if (report.mediumCount > 0)   parts.push(mediumBg(` ${report.mediumCount} medium `));
  if (report.lowCount > 0)      parts.push(lowBg(` ${report.lowCount} low `));

  if (parts.length === 0) {
    logger.log(passGreen(`  ✓ All clear`) + dim(` — ${total} server${total !== 1 ? 's' : ''} scanned in ${ms}ms`));
  } else {
    logger.log(`  ${parts.join('  ')}` + dim(`  ·  ${total} server${total !== 1 ? 's' : ''} in ${ms}ms`));
  }

  logger.emptyLine();
  logger.log(
    dim('  by ') +
    chalk.white.bold('Rodolf') +
    dim(' · ') +
    dim('thynk') +
    brand.bold('Q') +
    dim('  ') +
    chalk.hex('#339DFF').dim('thynkq.com')
  );
  logger.emptyLine();
}
