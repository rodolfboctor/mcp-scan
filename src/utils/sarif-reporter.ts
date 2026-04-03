import { ScanReport } from '../types/scan-result.js';
import fs from 'fs';
import path from 'path';

/**
 * Common security rules metadata for SARIF reporting.
 */
const SARIF_RULES: Record<string, { short: string, full: string, helpUri?: string }> = {
  'exposed-secret': {
     short: 'Exposed secret detected',
     full: 'A hardcoded secret, API key, or credential was found in the configuration.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/exposed-secret'
  },
  'data-exfiltration-risk': {
     short: 'Data exfiltration risk',
     full: 'A tool has both local read and external network egress capabilities.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/data-exfiltration-risk'
  },
  'credential-relay-risk': {
     short: 'Credential relay risk',
     full: 'Server forwards sensitive environment variables or credentials to an external sink.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/credential-relay-risk'
  },
  'network-egress-suspicious': {
     short: 'Suspicious network egress',
     full: 'The server contacts a known suspicious or malicious endpoint.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/network-egress-suspicious'
  },
  'prompt-injection-pattern': {
     short: 'Prompt injection risk',
     full: 'Potential for prompt injection through user-controlled inputs.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/prompt-injection'
  },
  'malicious-package': {
     short: 'Known malicious package',
     full: 'The server uses a package that has been flagged as malicious.',
     helpUri: 'https://thynkq.com/docs/mcp-scan/rules/malicious-package'
  }
};

export function generateSarif(report: ScanReport) {
  const sarif = {
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'mcp-scan',
            fullName: 'MCP Security Scanner',
            version: report.version || '2.0.0',
            informationUri: 'https://github.com/rodolfboctor/mcp-scan',
            rules: [] as any[],
          },
        },
        results: [] as any[],
      },
    ],
  };

  const rulesMap = new Map<string, any>();

  for (const result of report.results) {
    for (const finding of result.findings) {
      if (!rulesMap.has(finding.id)) {
        const metadata = SARIF_RULES[finding.id];
        rulesMap.set(finding.id, {
          id: finding.id,
          name: finding.id.replace(/-/g, '_'),
          shortDescription: {
            text: metadata?.short || finding.description.split('\n')[0],
          },
          fullDescription: {
            text: metadata?.full || finding.description,
          },
          helpUri: metadata?.helpUri || 'https://thynkq.com/docs/mcp-scan/rules',
          properties: {
            precision: 'high',
            problem: {
              severity: mapSeverityToSarifProblemSeverity(finding.severity),
            },
          },
        });
      }

      const level = mapSeverityToSarifLevel(finding.severity);
      const artifactPath = path.relative(process.cwd(), result.configPath);

      sarif.runs[0].results.push({
        ruleId: finding.id,
        level: level,
        message: {
          text: finding.description,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: artifactPath,
                uriBaseId: '%SRCROOT%',
              },
              region: {
                startLine: 1, // point to the top of the config file
              },
            },
          },
        ],
      });
    }
  }

  sarif.runs[0].tool.driver.rules = Array.from(rulesMap.values());

  return sarif;
}

function mapSeverityToSarifLevel(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'error';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
    case 'INFO':
    default:
      return 'note';
  }
}

function mapSeverityToSarifProblemSeverity(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'error';
    case 'MEDIUM':
      return 'warning';
    default:
      return 'recommendation';
  }
}

export function writeSarifReport(report: ScanReport, outputPath: string) {
  const sarif = generateSarif(report);
  fs.writeFileSync(outputPath, JSON.stringify(sarif, null, 2));
}
