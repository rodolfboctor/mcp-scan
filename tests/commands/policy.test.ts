import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runScan } from '../../src/commands/scan.js';
import fs from 'fs';

vi.mock('fs');

describe('Policy Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply blockedPackages policy', async () => {
    const policy = {
      blockedPackages: ['malicious-pkg']
    };
    
    vi.mocked(fs.existsSync).mockImplementation((p: string) => {
        if (p.toString().endsWith('.mcp-scan.json')) return true;
        if (p.toString().endsWith('config.json')) return true;
        return false;
    });

    vi.mocked(fs.readFileSync).mockImplementation((p: string) => {
        if (p.toString().endsWith('.mcp-scan.json')) return JSON.stringify(policy);
        if (p.toString().endsWith('config.json')) return JSON.stringify({
            mcpServers: {
                "test-server": {
                    command: "npx",
                    args: ["malicious-pkg"]
                }
            }
        });
        return '';
    });

    const report = await runScan({ silent: true, config: 'config.json' });
    const serverResult = report.results.find(r => r.serverName === 'test-server');
    expect(serverResult?.findings.some(f => f.id === 'blocked-package-policy')).toBe(true);
  });

  it('should apply suppressRules policy', async () => {
    const policy = {
      suppressRules: ['unverified-source']
    };

    vi.mocked(fs.existsSync).mockImplementation((p: string) => p.toString().endsWith('.mcp-scan.json') || p.toString().endsWith('config.json'));
    vi.mocked(fs.readFileSync).mockImplementation((p: string) => {
        if (p.toString().endsWith('.mcp-scan.json')) return JSON.stringify(policy);
        if (p.toString().endsWith('config.json')) return JSON.stringify({
            mcpServers: {
                "test-server": {
                    command: "npx",
                    args: ["@some/pkg"]
                }
            }
        });
        return '';
    });

    const report = await runScan({ silent: true, config: 'config.json' });
    const serverResult = report.results.find(r => r.serverName === 'test-server');
    expect(serverResult?.findings.some(f => f.id === 'unverified-source')).toBe(false);
  });
});
