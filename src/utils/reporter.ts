import { ScanReport } from '../types/scan-result.js';
import { logger } from './logger.js';
import { SEVERITY_ORDER } from '../types/severity.js';

export function printReport(report: ScanReport) {
  logger.divider();
  logger.brand(`mcp-scan results`);
  logger.divider();

  if (report.results.length === 0) {
    logger.info('No MCP servers detected to scan.');
    return;
  }

  for (const result of report.results) {
    const header = `${result.toolName} - ${result.serverName} (${result.scanDurationMs}ms)`;
    if (result.findings.length === 0) {
      logger.pass(`${header}: 0 findings`);
      continue;
    }

    logger.log(`\nServer: ${header}`);
    logger.detail(`Config: ${result.configPath}`);
    
    // Sort findings by severity desc
    const sortedFindings = [...result.findings].sort(
      (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
    );

    for (const finding of sortedFindings) {
      const msg = `[${finding.id}] ${finding.description}`;
      if (finding.severity === 'CRITICAL') logger.critical(msg);
      else if (finding.severity === 'HIGH') logger.high(msg);
      else if (finding.severity === 'MEDIUM') logger.medium(msg);
      else if (finding.severity === 'LOW') logger.low(msg);
      else logger.info(msg);

      if (finding.fixRecommendation) {
        logger.fix(finding.fixRecommendation);
      }
    }
  }

  logger.divider();
  const summaryMsg = `${report.totalScanned} servers scanned in ${report.totalDurationMs}ms. ` +
    `${report.criticalCount} critical, ${report.highCount} high, ${report.mediumCount} medium.`;

  if (report.criticalCount > 0 || report.highCount > 0) {
    logger.critical(summaryMsg);
  } else if (report.mediumCount > 0) {
    logger.medium(summaryMsg);
  } else {
    logger.pass(summaryMsg);
  }
}
