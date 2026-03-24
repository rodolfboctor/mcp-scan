import { describe, it, expect } from 'vitest';
import { generateSarif } from '../../src/utils/sarif-reporter.js';
import { ScanReport } from '../../src/types/scan-result.js';

describe('SARIF Reporter', () => {
  it('should generate a valid SARIF object', () => {
    const mockReport: ScanReport = {
      results: [
        {
          serverName: 'test-server',
          toolName: 'test-tool',
          configPath: '/test/path/config.json',
          scanDurationMs: 10,
          findings: [
            {
              id: 'exposed-secret',
              severity: 'CRITICAL',
              description: 'Exposed secret detected.',
              fixRecommendation: 'Remove secret.',
            },
          ],
        },
      ],
      totalScanned: 1,
      criticalCount: 1,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      totalDurationMs: 10,
      version: '1.4.0',
    };

    const sarif = generateSarif(mockReport);

    expect(sarif.version).toBe('2.1.0');
    expect(sarif.runs[0].tool.driver.name).toBe('mcp-scan');
    expect(sarif.runs[0].results).toHaveLength(1);
    expect(sarif.runs[0].results[0].ruleId).toBe('exposed-secret');
    expect(sarif.runs[0].results[0].level).toBe('error');
    expect(sarif.runs[0].tool.driver.rules).toHaveLength(1);
    expect(sarif.runs[0].tool.driver.rules[0].id).toBe('exposed-secret');
  });

  it('should map severities correctly', () => {
    const mockReport: ScanReport = {
      results: [
        {
          serverName: 'test',
          toolName: 'tool',
          configPath: 'path',
          findings: [
            { id: 'f1', severity: 'CRITICAL', description: 'd' },
            { id: 'f2', severity: 'HIGH', description: 'd' },
            { id: 'f3', severity: 'MEDIUM', description: 'd' },
            { id: 'f4', severity: 'LOW', description: 'd' },
            { id: 'f5', severity: 'INFO', description: 'd' },
          ],
          scanDurationMs: 0,
        },
      ],
      totalScanned: 1,
      criticalCount: 1,
      highCount: 1,
      mediumCount: 1,
      lowCount: 1,
      infoCount: 1,
      totalDurationMs: 0,
    };

    const sarif = generateSarif(mockReport);
    const results = sarif.runs[0].results;

    expect(results.find(r => r.ruleId === 'f1')?.level).toBe('error');
    expect(results.find(r => r.ruleId === 'f2')?.level).toBe('error');
    expect(results.find(r => r.ruleId === 'f3')?.level).toBe('warning');
    expect(results.find(r => r.ruleId === 'f4')?.level).toBe('note');
    expect(results.find(r => r.ruleId === 'f5')?.level).toBe('note');
  });
});
