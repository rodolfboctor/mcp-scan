import { describe, it, expect } from 'vitest';
import { generateSbom, generateSpdx } from '../../src/utils/sbom-generator.js';
import { ScanReport } from '../../src/types/scan-result.js';

describe('SBOM Generator', () => {
  const mockReport: ScanReport = {
    results: [
      {
        serverName: 'test-server',
        toolName: 'test-tool',
        configPath: '/path/to/config',
        scanDurationMs: 100,
        findings: [
            { id: 'exposed-secret', severity: 'CRITICAL', description: 'Hardcoded key' }
        ],
        metadata: {
          packageName: '@mcp/test-server',
          version: '1.2.3',
          license: 'MIT',
          repositoryUrl: 'https://github.com/mcp/test-server',
          source: 'npm',
          integrity: 'sha512-abc'
        }
      }
    ],
    totalScanned: 1,
    criticalCount: 1,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalDurationMs: 100,
    version: '2.0.0'
  };

  it('1. should generate a valid CycloneDX SBOM with findings', async () => {
    const sbom = await generateSbom(mockReport, { includeFindings: true });

    expect(sbom.bomFormat).toBe('CycloneDX');
    expect(sbom.specVersion).toBe('1.5');
    expect(sbom.components).toHaveLength(1);
    expect(sbom.components[0].name).toBe('@mcp/test-server');
    expect(sbom.components[0].hashes[0].content).toBe('sha512-abc');
    
    expect(sbom.vulnerabilities).toHaveLength(1);
    expect(sbom.vulnerabilities[0].id).toBe('exposed-secret');
    expect(sbom.vulnerabilities[0].ratings[0].severity).toBe('critical');
  });

  it('2. should generate a valid SPDX SBOM', async () => {
    const spdx = generateSpdx(mockReport);

    expect(spdx).toContain('SPDXVersion: SPDX-2.3');
    expect(spdx).toContain('PackageName: @mcp/test-server');
    expect(spdx).toContain('PackageVersion: 1.2.3');
    expect(spdx).toContain('PackageLicenseConcluded: MIT');
  });

  it('3. should handle results without metadata', async () => {
    const emptyReport: ScanReport = {
      results: [{ serverName: 'local', toolName: 't', configPath: '', findings: [], scanDurationMs: 0 }],
      totalScanned: 1, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, infoCount: 0, totalDurationMs: 0
    };

    const sbom = await generateSbom(emptyReport);
    expect(sbom.components[0].name).toBe('local');
    expect(sbom.components[0].version).toBe('0.0.0');
    
    const spdx = generateSpdx(emptyReport);
    expect(spdx).toContain('PackageName: local');
    expect(spdx).toContain('PackageVersion: 0.0.0');
  });
});
