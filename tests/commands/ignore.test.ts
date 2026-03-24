import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runScan } from '../../src/commands/scan.js';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

describe('Ignore List', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should suppress findings in .mcp-scan-ignore', async () => {
    const mockIgnorePath = path.join(process.cwd(), '.mcp-scan-ignore');
    const mockConfigPath = 'config.json';
    const resolvedConfigPath = path.resolve(mockConfigPath);
    const mockPolicyPath = path.join(process.cwd(), '.mcp-scan.json');

    vi.mocked(fs.existsSync).mockImplementation((p: any) => {
        const pathStr = p.toString();
        if (pathStr === mockIgnorePath) return true;
        if (pathStr === mockPolicyPath) return false;
        if (pathStr === mockConfigPath || pathStr === resolvedConfigPath) return true;
        return false;
    });

    vi.mocked(fs.readFileSync).mockImplementation((p: any) => {
        const pathStr = p.toString();
        if (pathStr === mockIgnorePath) return 'unverified-source\n';
        if (pathStr === mockConfigPath || pathStr === resolvedConfigPath) return JSON.stringify({
            mcpServers: { "test": { command: "npx", args: ["some-pkg"] } }
        });
        return '';
    });

    // Set severity to 'info' to see suppressed findings
    const report = await runScan({ silent: true, config: mockConfigPath, severity: 'info' });
    const serverResult = report.results[0];
    const finding = serverResult.findings.find(f => f.id === 'unverified-source');
    
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe('INFO');
    expect(finding?.description).toContain('[SUPPRESSED]');
  });
});
