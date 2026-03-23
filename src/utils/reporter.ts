import Table from 'cli-table3';
import { ScanReport } from '../types/scan-result.js';
import { logger } from './logger.js';
import { SEVERITY_ORDER } from '../types/severity.js';

import chalk from 'chalk';

const brand = chalk.hex('#339DFF');
const accentGray = chalk.hex('#8B949E');
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
  const boxWidth = 50;
  const border = brand;
  
  logger.log(border('  ╭' + '─'.repeat(boxWidth - 4) + '╮'));
  logger.log(border('  │') + ' '.repeat(boxWidth - 4) + border('│'));
  
  const titleLine = `   🛡️  ${chalk.white.bold('mcp-scan')}  ${dim('v' + (report.version || '1.0.3'))}`;
  const subtitleLine = `   ${accentGray('Security scanner for MCP server configs')}`;
  
  logger.log(border('  │') + titleLine.padEnd(boxWidth - 4 + 10) + border('│')); // +10 for ANSI escape codes
  logger.log(border('  │') + subtitleLine.padEnd(boxWidth - 4 + 10) + border('│'));
  
  logger.log(border('  │') + ' '.repeat(boxWidth - 4) + border('│'));
  logger.log(border('  ╰' + '─'.repeat(boxWidth - 4) + '╯'));
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

    const rail = brand.dim('  │ ');
    
    logger.log(brand('  ┌ ') + brand.bold(result.toolName) + accentGray(' › ') + chalk.white.bold(result.serverName));
    logger.log(rail + dim(result.configPath));
    logger.log(rail);

    for (const finding of sortedFindings) {
      logger.log(rail + ` ${severityBadge(finding.severity)}  ${chalk.bold(finding.id)}`);
      logger.log(rail + `           ${chalk.white(finding.description)}`);
      if (finding.fixRecommendation) {
        logger.log(rail + dim(`           ↳ ${finding.fixRecommendation}`));
      }
      logger.log(rail);
    }

    logger.log(brand.dim('  └' + '─'.repeat(55)));
    logger.emptyLine();
  }

  // Clean servers summary
  if (clean.length > 0) {
    const maxNameLength = Math.max(...clean.map(r => `${r.toolName} › ${r.serverName}`.length));
    
    for (const result of clean) {
      const name = `${result.toolName} › ${result.serverName}`;
      logger.log(passGreen(`  ✓ `) + name.padEnd(maxNameLength + 2) + dim('0 issues'));
    }
    logger.emptyLine();
  }

  // Final summary section
  const total = report.totalScanned;
  const ms = report.totalDurationMs;
  const uniqueClients = new Set(report.results.map(r => r.toolName)).size;
  
  const divider = brand.dim('  ' + '─'.repeat(50));
  
  logger.log(divider);
  logger.emptyLine();

  if (report.criticalCount === 0 && report.highCount === 0 && report.mediumCount === 0 && report.lowCount === 0) {
    logger.log(passGreen(`   ✓ All clear`) + dim(` — ${total} server${total !== 1 ? 's' : ''} scanned in ${ms}ms`));
  } else {
    logger.log(chalk.white(`   Scanned ${chalk.bold(total)} server${total !== 1 ? 's' : ''} across ${chalk.bold(uniqueClients)} client${uniqueClients !== 1 ? 's' : ''} in ${ms}ms`));
    logger.emptyLine();
    
    const parts = [
      report.criticalCount > 0 ? chalk.hex('#F85149').bold(`    ${report.criticalCount} critical`) : dim(`    0 critical`),
      report.highCount > 0     ? chalk.hex('#F0883E').bold(`    ${report.highCount} high`)     : dim(`    0 high`),
      report.mediumCount > 0   ? chalk.hex('#D29922').bold(`    ${report.mediumCount} medium`) : dim(`    0 medium`),
      report.lowCount > 0      ? dim.bold(`    ${report.lowCount} low`) : dim(`    0 low`),
    ];
    logger.log(parts.join(''));
  }

  logger.emptyLine();
  logger.log(divider);
  logger.emptyLine();
  logger.log(
    dim('  by ') +
    chalk.white.bold('Rodolf') +
    accentGray(' · ') +
    accentGray('thynk') +
    brand.bold('Q') +
    accentGray('  ') +
    brand.dim.underline('thynkq.com')
  );
  logger.emptyLine();
}
