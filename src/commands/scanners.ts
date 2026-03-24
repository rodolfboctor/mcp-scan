import Table from 'cli-table3';
import { logger } from '../utils/logger.js';

const SCANNERS = [
  { name: 'secret-scanner', description: 'Detects exposed API keys and secrets (43+ formats).' },
  { name: 'typosquat-scanner', description: 'Detects typosquatting via Levenshtein distance and homoglyph detection.' },
  { name: 'registry-scanner', description: 'Checks packages against known malicious MCP package lists.' },
  { name: 'permission-scanner', description: 'Flags overly broad filesystem permissions (e.g. / instead of ~/projects).' },
  { name: 'transport-scanner', description: 'Checks transport protocols and authentication (HTTP vs HTTPS, Bearer tokens).' },
  { name: 'config-scanner', description: 'Detects shell injection vectors and argument list issues.' },
  { name: 'prompt-injection-scanner', description: 'Scans tool descriptions for prompt injection patterns and unicode tricks.' },
  { name: 'env-leak-scanner', description: 'Scans for secrets leaking through environment variable passthrough.' },
  { name: 'ast-scanner', description: 'Static analysis for reverse shells, eval() abuse, and data exfiltration.' },
  { name: 'package-scanner', description: 'Deep package audit with OSV.dev CVE lookup and version verification.' },
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
