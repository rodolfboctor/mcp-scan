import Table from 'cli-table3';
import { logger } from '../utils/logger.js';

const SCANNERS = [
  { name: 'secret-scanner', description: 'Detects exposed API keys and secrets (52+ formats, including entropy-based detection).' },
  { name: 'typosquat-scanner', description: 'Detects typosquatting via Levenshtein distance and homoglyph detection.' },
  { name: 'registry-scanner', description: 'Checks packages against known malicious MCP package lists.' },
  { name: 'permission-scanner', description: 'Flags overly broad filesystem permissions (e.g. / instead of ~/projects).' },
  { name: 'transport-scanner', description: 'Checks transport protocols and authentication (HTTP vs HTTPS, ws:// vs wss://).' },
  { name: 'config-scanner', description: 'Detects shell injection vectors and argument list issues.' },
  { name: 'prompt-injection-scanner', description: 'Scans tool descriptions for prompt injection patterns and unicode tricks.' },
  { name: 'env-leak-scanner', description: 'Scans for secrets leaking through environment variable passthrough.' },
  { name: 'ast-scanner', description: 'Static analysis for reverse shells, eval() abuse, and data exfiltration.' },
  { name: 'package-scanner', description: 'Deep package audit with OSV.dev CVE lookup (critical/high/medium) and version checks.' },
  { name: 'tool-poisoning-scanner', description: 'Detects tool poisoning and capability injection via natural language instructions.' },
  { name: 'supply-chain-scanner', description: 'Calculates trust scores based on GitHub stars, forks, and recent activity.' },
  { name: 'license-scanner', description: 'Checks for open-source license compliance and risk (e.g. GPL, AGPL, EUPL).' },
  { name: 'network-egress-scanner', description: 'Detects suspicious outbound connections, obfuscated URLs, and raw IP addresses.' },
  { name: 'data-flow-scanner', description: 'Traces data flows from sensitive sources to external sinks (screen capture, keychain, etc.).' },
  { name: 'data-controls-scanner', description: 'Audits PII handling, data retention, and privacy compliance (GDPR, HIPAA).' },
];

export function listScanners() {
  const table = new Table({
    head: ['Scanner', 'Description'],
    style: { head: ['cyan'] }
  });

  for (const scanner of SCANNERS) {
    table.push([scanner.name, scanner.description]);
  }

  logger.log(table.toString());
  logger.brand(`Total scanners available: ${SCANNERS.length}`);
}
