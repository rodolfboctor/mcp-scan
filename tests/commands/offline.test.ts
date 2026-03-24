import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runScan } from '../../src/commands/scan.js';
import fs from 'fs';

vi.mock('fs');

describe('Offline Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should not make network calls when --offline is used', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: string) => {
        if (p.toString().endsWith('config.json')) return true;
        if (p.toString().endsWith('cve-snapshot.json')) return true;
        if (p.toString().endsWith('.mcp-scan.json')) return false;
        return false;
    });

    vi.mocked(fs.readFileSync).mockImplementation((p: string) => {
        if (p.toString().endsWith('config.json')) return JSON.stringify({
            mcpServers: { "test": { command: "npx", args: ["some-pkg"] } }
        });
        if (p.toString().endsWith('cve-snapshot.json')) return JSON.stringify({
            packages: { "some-pkg": { version: "1.0.0", license: "MIT", vulns: [] } },
            updatedAt: new Date().toISOString()
        });
        return '';
    });

    await runScan({ silent: true, config: 'config.json', offline: true, sbom: 'sbom.json' });
    
    expect(fetch).not.toHaveBeenCalled();
  });
});
