import { describe, it, expect } from 'vitest';
import { runScan } from '../src/commands/scan.js';
import path from 'path';

describe('E2E Scan', () => {
  it('should run a full scan on a vulnerable fixture and find issues', async () => {
    const fixturePath = path.join(__dirname, 'fixtures/vulnerable-config.json');
    const report = await runScan({ config: fixturePath, silent: true });

    expect(report.totalScanned).toBeGreaterThan(0);
    // vulnerable-config.json has a ghp_ token and a dangerous path '/'
    expect(report.criticalCount).toBeGreaterThan(0);
    expect(report.highCount).toBeGreaterThan(0);
    
    const githubResult = report.results.find(r => r.serverName === 'github');
    expect(githubResult).toBeDefined();
    expect(githubResult?.findings.some(f => f.id === 'exposed-secret')).toBe(true);

    const fsResult = report.results.find(r => r.serverName === 'filesystem-danger');
    expect(fsResult).toBeDefined();
    expect(fsResult?.findings.some(f => f.id === 'excessive-permissions')).toBe(true);
  });

  it('should run a full scan on a malicious fixture', async () => {
    const fixturePath = path.join(__dirname, 'fixtures/malicious-config.json');
    const report = await runScan({ config: fixturePath, silent: true });

    expect(report.totalScanned).toBeGreaterThan(0);
    // malicious-config.json has known malicious packages
    expect(report.criticalCount).toBeGreaterThan(0);
    
    const elonResult = report.results.find(r => r.serverName === 'what-would-elon-do');
    expect(elonResult).toBeDefined();
    expect(elonResult?.findings.some(f => f.id === 'known-malicious')).toBe(true);
  });
});
