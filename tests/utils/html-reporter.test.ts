import { describe, it, expect, vi } from 'vitest';
import { generateHtmlReport } from '../../src/utils/html-reporter.js';
import { ScanReport } from '../../src/types/scan-result.js';

describe('html-reporter', () => {
  it('should generate a valid HTML report string', () => {
    const mockReport: ScanReport = {
      results: [
        {
          serverName: 'test-server',
          toolName: 'test-tool',
          configPath: '/path/to/config',
          scanDurationMs: 100,
          findings: [
            {
              id: 'exposed-secret',
              severity: 'CRITICAL',
              description: 'Hardcoded API key found',
              fixRecommendation: 'Use environment variables',
              fixable: true
            }
          ]
        }
      ],
      totalScanned: 1,
      criticalCount: 1,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      totalDurationMs: 100,
      version: '1.0.3'
    };

    const html = generateHtmlReport(mockReport);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('mcp-scan');
    expect(html).toContain('test-server');
    expect(html).toContain('exposed-secret');
    expect(html).toContain('CRITICAL');
    expect(html).toContain('Hardcoded API key found');
  });

  it('should handle empty reports', () => {
    const emptyReport: ScanReport = {
      results: [],
      totalScanned: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      totalDurationMs: 10,
      version: '1.0.3'
    };

    const html = generateHtmlReport(emptyReport);
    expect(html).toContain('No MCP servers detected');
  });
});
