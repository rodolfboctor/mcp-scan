import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runDiff } from '../../src/commands/diff.js';
import fs from 'fs';
import { logger } from '../../src/utils/logger.js';

vi.mock('fs');
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    brand: vi.fn(),
    detail: vi.fn(),
    divider: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    emptyLine: vi.fn(),
    high: vi.fn(),
    pass: vi.fn(),
    error: vi.fn(),
  }
}));

describe('diff command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = 0;
  });

  it('should detect regressions and set exit code 1', async () => {
    const oldReport = {
      results: [
        { serverName: 's1', toolName: 't1', findings: [] }
      ],
      totalScanned: 1
    };
    const newReport = {
      results: [
        { serverName: 's1', toolName: 't1', findings: [{ id: 'f1', severity: 'HIGH' }] }
      ],
      totalScanned: 1
    };

    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(oldReport));
    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(newReport));

    await runDiff('old.json', 'new.json');

    expect(logger.high).toHaveBeenCalledWith(expect.stringContaining('Regressions / New Findings (1)'));
    expect(process.exitCode).toBe(1);
  });

  it('should detect resolved findings', async () => {
    const oldReport = {
      results: [
        { serverName: 's1', toolName: 't1', findings: [{ id: 'f1', severity: 'HIGH' }] }
      ],
      totalScanned: 1
    };
    const newReport = {
      results: [
        { serverName: 's1', toolName: 't1', findings: [] }
      ],
      totalScanned: 1
    };

    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(oldReport));
    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(newReport));

    await runDiff('old.json', 'new.json');

    expect(logger.pass).toHaveBeenCalledWith(expect.stringContaining('Resolved Findings (1)'));
    expect(process.exitCode).toBe(0);
  });

  it('should handle added and removed servers', async () => {
    const oldReport = {
      results: [
        { serverName: 's1', toolName: 't1', findings: [] }
      ],
      totalScanned: 1
    };
    const newReport = {
      results: [
        { serverName: 's2', toolName: 't1', findings: [] }
      ],
      totalScanned: 1
    };

    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(oldReport));
    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(newReport));

    await runDiff('old.json', 'new.json');

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Servers Added (1)'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Servers Removed (1)'));
  });
});
