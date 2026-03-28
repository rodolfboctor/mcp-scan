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
  | 'duplicate-server'
  | 'supply-chain-low-trust'
  | 'supply-chain-rug-pull'
  | 'hidden-instruction-risk'
  | 'capability-escalation-risk'
  | 'tool-exfiltration-risk'
  | 'env-var-scope-leak'
  | 'high-entropy-value'
  | 'license-risk'
  | 'exfiltration-vector'
  | 'blocked-package-policy'
  | 'env-var-prefix-risk'
  | 'server-mutation'
  | 'upgrade-available'
  | 'data-exfiltration-risk'
  | 'credential-relay-risk'
  | 'cross-server-flow'
  | 'temp-storage-risk'
  | 'network-egress-suspicious'
  | 'network-egress-non-standard-port'
  | 'network-egress-obfuscated'
  | 'network-egress-raw-ip'
  | 'network-egress-telemetry'
  | 'network-egress-api'
  | 'network-egress-unknown'
  | 'data-controls-pii'
  | 'data-controls-consent-gap'
  | 'data-controls-retention-gap'
  | 'data-controls-deletion-gap'
  | 'data-controls-encryption-gap'
  | 'data-controls-prompt-logging'
  | 'data-controls-sharing'
  | 'data-controls-old-temp-files';

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
  'supply-chain-low-trust',
  'supply-chain-rug-pull',
  'hidden-instruction-risk',
  'capability-escalation-risk',
  'tool-exfiltration-risk',
  'env-var-scope-leak',
  'high-entropy-value',
  'license-risk',
  'exfiltration-vector',
  'blocked-package-policy',
  'env-var-prefix-risk',
  'server-mutation',
  'upgrade-available',
  'data-exfiltration-risk',
  'credential-relay-risk',
  'cross-server-flow',
  'temp-storage-risk',
  'network-egress-suspicious',
  'network-egress-non-standard-port',
  'network-egress-obfuscated',
  'network-egress-raw-ip',
  'network-egress-telemetry',
  'network-egress-api',
  'network-egress-unknown',
  'data-controls-pii',
  'data-controls-consent-gap',
  'data-controls-retention-gap',
  'data-controls-deletion-gap',
  'data-controls-encryption-gap',
  'data-controls-prompt-logging',
  'data-controls-sharing',
  'data-controls-old-temp-files',
];

export interface Finding {
  id: string;
  severity: Severity;
  description: string;
  fixRecommendation?: string;
  fixable?: boolean;
  remediationConfidence?: number; // 1-100
}

export interface ServerScanResult {
  serverName: string;
  toolName: string;
  configPath: string;
  findings: Finding[];
  scanDurationMs: number;
  trustScore?: number;
  /** Original server connection details from MCP config */
  connection?: {
    command?: string;
    args?: string[];
    url?: string;
    type?: string;
    env?: string[]; // Sorted keys for fingerprinting
  };
  metadata?: {
    packageName?: string;
    version?: string;
    license?: string;
    repositoryUrl?: string;
    author?: string;
    source?: 'npm' | 'local' | 'unknown';
  };
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
