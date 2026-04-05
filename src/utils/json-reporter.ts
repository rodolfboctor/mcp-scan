import { ScanReport } from '../types/scan-result.js';

export function printJsonReport(report: ScanReport) {
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Returns a machine-friendly summary object (useful for CI pipelines and scripting).
 */
export function buildJsonSummary(report: ScanReport) {
  return {
    version: report.version,
    scannedAt: new Date().toISOString(),
    totalScanned: report.totalScanned,
    totalFindings: report.criticalCount + report.highCount + report.mediumCount + report.lowCount + report.infoCount,
    severity: {
      critical: report.criticalCount,
      high: report.highCount,
      medium: report.mediumCount,
      low: report.lowCount,
      info: report.infoCount,
    },
    pass: report.criticalCount === 0 && report.highCount === 0,
    durationMs: report.totalDurationMs,
  };
}
