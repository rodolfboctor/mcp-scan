import { runScan } from './commands/scan.js';
import { detectTools } from './config/detector.js';
import { ScanReport, ServerScanResult, Finding } from './types/scan-result.js';

export {
  runScan,
  detectTools,
};

export type {
  ScanReport,
  ServerScanResult,
  Finding,
};

export interface ScanOptions {
  silent?: boolean;
  json?: boolean;
  verbose?: boolean;
  severity?: string;
  fix?: boolean;
  config?: string;
  version?: string;
  ugig?: boolean;
  ci?: boolean;
}
