import { ScanReport } from '../types/scan-result.js';

export function printJsonReport(report: ScanReport) {
  console.log(JSON.stringify(report, null, 2));
}
