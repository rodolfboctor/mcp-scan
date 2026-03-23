import { Severity } from './severity.js';

export interface Finding {
  id: string;
  severity: Severity;
  description: string;
  fixRecommendation?: string;
  fixable?: boolean;
}

export interface ServerScanResult {
  serverName: string;
  toolName: string;
  configPath: string;
  findings: Finding[];
  scanDurationMs: number;
}

export interface ScanReport {
  results: ServerScanResult[];
  totalScanned: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  totalDurationMs: number;
  version?: string;
}
