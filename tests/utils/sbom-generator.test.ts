import { describe, it, expect } from 'vitest';
import { generateSbom } from '../../src/utils/sbom-generator.js';
import { ScanReport } from '../../src/types/scan-result.js';

describe('sbom-generator', () => {
  it('should generate a valid CycloneDX SBOM', async () => {
    const mockReport: ScanReport = {
      results: [
        {
          serverName: 'test-server',
          toolName: 'test-tool',
          configPath: '/path/to/config',
          scanDurationMs: 100,
          findings: [],
          metadata: {
            packageName: '@mcp/test-server',
            version: '1.2.3',
            license: 'MIT',
            repositoryUrl: 'https://github.com/mcp/test-server',
            source: 'npm'
          }
        }
      ],
      totalScanned: 1,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      totalDurationMs: 100,
      version: '1.0.3'
    };

    const sbom = await generateSbom(mockReport);

    expect(sbom.bomFormat).toBe('CycloneDX');
    expect(sbom.specVersion).toBe('1.5');
    expect(sbom.components).toHaveLength(1);
    expect(sbom.components[0].name).toBe('@mcp/test-server');
    expect(sbom.components[0].version).toBe('1.2.3');
    expect(sbom.components[0].licenses[0].license.id).toBe('MIT');
    expect(sbom.components[0].externalReferences[0].url).toBe('https://github.com/mcp/test-server');
  });

  it('should handle results without metadata', async () => {
    const mockReport: ScanReport = {
      results: [
        {
          serverName: 'local-server',
          toolName: 'test-tool',
          configPath: '/path/to/config',
          scanDurationMs: 50,
          findings: []
        }
      ],
      totalScanned: 1,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      infoCount: 0,
      totalDurationMs: 50,
      version: '1.0.3'
    };

    const sbom = await generateSbom(mockReport);
    expect(sbom.components).toHaveLength(1);
    expect(sbom.components[0].name).toBe('local-server');
    expect(sbom.components[0].version).toBe('0.0.0');
  });
});
