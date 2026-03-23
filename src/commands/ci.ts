import { runScan } from './scan.js';
import { printJsonReport } from '../utils/json-reporter.js';
import { SEVERITY_ORDER, Severity } from '../types/severity.js';

export async function runCi(options: { maxSeverity?: string }) {
  const maxSeverityStr = (options.maxSeverity || 'high').toUpperCase() as Severity;
  const maxSeverityThreshold = SEVERITY_ORDER[maxSeverityStr] || SEVERITY_ORDER.HIGH;

  const report = await runScan({ silent: true, json: true });
  
  printJsonReport(report);

  let shouldFail = false;
  if (report.criticalCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.CRITICAL) shouldFail = true;
  if (report.highCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.HIGH) shouldFail = true;
  if (report.mediumCount > 0 && maxSeverityThreshold <= SEVERITY_ORDER.MEDIUM) shouldFail = true;

  if (shouldFail) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
