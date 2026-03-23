import Table from 'cli-table3';
import { ScanReport } from '../types/scan-result.js';
import { logger } from './logger.js';
import { SEVERITY_ORDER } from '../types/severity.js';

export function printReport(report: ScanReport) {
  logger.emptyLine();
  logger.brand('╔════════════════════════════════════════════╗');
  logger.brand('║              mcp-scan results              ║');
  logger.brand('╚════════════════════════════════════════════╝');
  logger.emptyLine();

  if (report.results.length === 0) {
    logger.info('No MCP servers detected to scan.');
    return;
  }

  for (const result of report.results) {
    const header = `${result.toolName} - ${result.serverName}`;
    if (result.findings.length === 0) {
      logger.pass(`${header} (0 findings)`);
      continue;
    }

    logger.log(header);
    logger.detail(`Config: ${result.configPath}`);
    
    const sortedFindings = [...result.findings].sort(
      (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
    );

    const table = new Table({
        head: ['Severity', 'ID', 'Description', 'Recommendation'],
        colWidths: [12, 25, 45, 45],
        style: { head: ['cyan'] }
    });

    for (const finding of sortedFindings) {
        table.push([
            finding.severity,
            finding.id,
            finding.description,
            finding.fixRecommendation || 'N/A'
        ]);
    }
    logger.log(table.toString());
    logger.emptyLine();
  }

  logger.divider();
  const summaryMsg = `${report.totalScanned} servers scanned in ${report.totalDurationMs}ms. ` +
    `Critical: ${report.criticalCount}, High: ${report.highCount}, Medium: ${report.mediumCount}.`;

  if (report.criticalCount > 0) {
    logger.critical(summaryMsg);
  } else if (report.highCount > 0) {
    logger.high(summaryMsg);
  } else if (report.mediumCount > 0) {
    logger.medium(summaryMsg);
  } else {
    logger.pass(summaryMsg);
  }
  logger.emptyLine();
}
