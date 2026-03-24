import { ScanReport } from '../types/scan-result.js';
import fs from 'fs';
import path from 'path';

export function generateSarif(report: ScanReport) {
  const sarif = {
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'mcp-scan',
            version: report.version || 'unknown',
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
        rulesMap.set(finding.id, {
          id: finding.id,
          shortDescription: {
            text: finding.description,
          },
          help: {
            text: finding.fixRecommendation || finding.description,
          },
          properties: {
            precision: 'high',
          },
        });
      }

      const level = mapSeverityToSarifLevel(finding.severity);

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
                uri: path.relative(process.cwd(), result.configPath),
              },
              // We don't have exact line numbers for JSON/TOML keys easily without a full parser
              // But we can just point to the file
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

export function writeSarifReport(report: ScanReport, outputPath: string) {
  const sarif = generateSarif(report);
  fs.writeFileSync(outputPath, JSON.stringify(sarif, null, 2));
}
