import { describe, it, expect, vi, afterEach } from 'vitest';
import { runCompliance } from '../../src/commands/compliance.js';
import fs from 'fs';

vi.mock('../../src/commands/scan.js', () => ({
  runScan: vi.fn().mockResolvedValue({
      results: [{
          findings: [
              { id: 'exposed-secret', severity: 'CRITICAL', description: 'Hardcoded secret found in config' },
              { id: 'data-controls-retention-gap', severity: 'MEDIUM', description: 'No retention policy detected' },
              { id: 'data-controls-pii', severity: 'HIGH', description: 'Server handles PII' },
              { id: 'network-egress-raw-ip', severity: 'HIGH', description: 'Direct connection to raw IP' }
          ]
      }]
  })
}));

describe('Compliance Command', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        if (fs.existsSync('test-report.json')) fs.unlinkSync('test-report.json');
        if (fs.existsSync('test-report.csv')) fs.unlinkSync('test-report.csv');
        if (fs.existsSync('test-report.md')) fs.unlinkSync('test-report.md');
    });

    it('1. Compliance report with mixed findings -> correct criteria mapping', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await runCompliance({ framework: 'soc2' });
        const output = consoleSpy.mock.calls[0][0];
        expect(output).toContain('CC6.1');
        expect(output).toContain('findings');
        expect(output).toContain('Compliance Score');
    });

    it('3. Each framework flag works', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        await runCompliance({ framework: 'gdpr' });
        expect(consoleSpy.mock.calls[0][0]).toContain('GDPR');
        
        await runCompliance({ framework: 'hipaa' });
        expect(consoleSpy.mock.calls[1][0]).toContain('HIPAA');
        
        await runCompliance({ framework: 'pci-dss' });
        expect(consoleSpy.mock.calls[2][0]).toContain('PCI DSS');
        
        await runCompliance({ framework: 'nist' });
        expect(consoleSpy.mock.calls[3][0]).toContain('NIST');
    });

    it('4. --framework all includes all frameworks', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await runCompliance({ framework: 'all' });
        const output = consoleSpy.mock.calls[0][0];
        expect(output).toContain('SOC 2');
        expect(output).toContain('GDPR');
        expect(output).toContain('HIPAA');
    });

    it('5. JSON output is valid', async () => {
        await runCompliance({ framework: 'soc2', output: 'test-report.json' });
        expect(fs.existsSync('test-report.json')).toBe(true);
        const data = JSON.parse(fs.readFileSync('test-report.json', 'utf8'));
        expect(data[0].name).toContain('SOC 2');
        expect(data[0].complianceScore).toBeDefined();
    });

    it('6. CSV output is valid', async () => {
        await runCompliance({ framework: 'soc2', output: 'test-report.csv' });
        expect(fs.existsSync('test-report.csv')).toBe(true);
        const data = fs.readFileSync('test-report.csv', 'utf8');
        expect(data).toContain('Framework,ControlID,Description');
        expect(data).toContain('SOC 2');
    });

    it('7. Markdown output is valid', async () => {
        await runCompliance({ framework: 'soc2', output: 'test-report.md' });
        expect(fs.existsSync('test-report.md')).toBe(true);
        const data = fs.readFileSync('test-report.md', 'utf8');
        expect(data).toContain('# Compliance Framework Mapping Report');
        expect(data).toContain('## SOC 2');
        expect(data).toContain('**Compliance Score:**');
    });

    it('8. Unknown framework name -> clear error message', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        // Mock process.exitCode to avoid affecting other tests if it was used
        await runCompliance({ framework: 'unknown-fw' });
        expect(consoleSpy.mock.calls[0][0]).toContain('Error: Unknown framework');
    });
});
