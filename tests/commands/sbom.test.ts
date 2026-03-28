import { describe, it, expect, vi, afterEach } from 'vitest';
import { runSbom } from '../../src/commands/sbom.js';
import fs from 'fs';

vi.mock('../../src/commands/scan.js', () => ({
  runScan: vi.fn().mockResolvedValue({
      results: [{
          serverName: 'test-server',
          metadata: {
              packageName: 'test-package',
              version: '1.0.0'
          }
      }]
  })
}));

describe('SBOM Command', () => {
    afterEach(() => {
        if (fs.existsSync('test-sbom.json')) fs.unlinkSync('test-sbom.json');
        if (fs.existsSync('test-sbom.spdx')) fs.unlinkSync('test-sbom.spdx');
    });

    it('1. Generates CycloneDX SBOM', async () => {
        await runSbom({ format: 'cyclonedx', output: 'test-sbom.json' });
        expect(fs.existsSync('test-sbom.json')).toBe(true);
        const data = JSON.parse(fs.readFileSync('test-sbom.json', 'utf8'));
        expect(data.bomFormat).toBe('CycloneDX');
        expect(data.specVersion).toBe('1.5');
        expect(data.components[0].name).toBe('test-package');
    });

    it('2. Generates SPDX SBOM', async () => {
        await runSbom({ format: 'spdx', output: 'test-sbom.spdx' });
        expect(fs.existsSync('test-sbom.spdx')).toBe(true);
        const data = fs.readFileSync('test-sbom.spdx', 'utf8');
        expect(data).toContain('SPDXVersion: SPDX-2.3');
        expect(data).toContain('PackageName: test-package');
    });
});