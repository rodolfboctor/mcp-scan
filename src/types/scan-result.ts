import { Severity } from './severity.js';

export type FindingId =
  | 'no-malicious-package'
  | 'malicious-package'
  | 'no-typosquatting'
  | 'typosquatting-package'
  | 'outdated-package'
  | 'unmaintained-package'
  | 'known-vulnerability-critical'
  | 'known-vulnerability-high'
  | 'prompt-injection-pattern'
  | 'unicode-injection'
  | 'tool-name-shadow'
  | 'schema-bypass-risk'
  | 'exposed-secret'
  | 'missing-referenced-env-var'
  | 'duplicate-server';

export const FINDING_IDS: FindingId[] = [
  'no-malicious-package',
  'malicious-package',
  'no-typosquatting',
  'typosquatting-package',
  'outdated-package',
  'unmaintained-package',
  'known-vulnerability-critical',
  'known-vulnerability-high',
  'prompt-injection-pattern',
  'unicode-injection',
  'tool-name-shadow',
  'schema-bypass-risk',
  'exposed-secret',
  'missing-referenced-env-var',
  'duplicate-server',
];

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
