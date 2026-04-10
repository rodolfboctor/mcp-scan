import { runScan } from './scan.js';
import { printJsonReport } from '../utils/json-reporter.js';
import { SEVERITY_ORDER, Severity } from '../types/severity.js';

export async function runCi(options: { maxSeverity?: string, json?: boolean }) {
  const maxSeverityStr = (options.maxSeverity || 'high').toUpperCase() as Severity;
  const maxSeverityThreshold = SEVERITY_ORDER[maxSeverityStr] || SEVERITY_ORDER.HIGH;

  const report = await runScan({ silent: true, ci: true });

  printJsonReport(report);

  let shouldFail = false;
  if (report.criticalCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.CRITICAL) shouldFail = true;
  if (report.highCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.HIGH) shouldFail = true;
  if (report.mediumCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.MEDIUM) shouldFail = true;

  const exitCode = shouldFail ? 1 : 0;

  // Print summary to stderr so CI systems can capture it separately from JSON stdout
  const totalFindings = report.criticalCount + report.highCount + report.mediumCount + report.lowCount;
  process.stderr.write(`mcp-scan: ${totalFindings} finding(s), exit code ${exitCode}\n`);

  process.exit(exitCode);
}
