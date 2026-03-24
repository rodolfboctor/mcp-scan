import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanPackageDeep } from '../../src/scanners/package-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';
import { FindingId } from '../../src/types/scan-result.js';

// Mock logger to suppress console output during tests
vi.mock('../../src/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('scanPackageDeep', () => {
  const mockServer: ResolvedServer = {
    name: 'test-server',
    command: 'npm',
    args: ['install', 'test-package'],
    path: '/tmp/test',
    env: {},
    labels: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); // Use fake timers to control timeouts
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers after each test
  });

  it('should return empty findings if package name cannot be extracted', async () => {
    const serverWithoutPackage: ResolvedServer = {
      name: 'test-server',
      command: 'npm',
      args: [],
      path: '/tmp/test',
      env: {},
      labels: [],
    };
    const findings = await scanPackageDeep(serverWithoutPackage);
    expect(findings).toEqual([]);
  });

  describe('npm registry lookup', () => {
    it('should identify stale package if last modified is over 6 months ago', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        if (url.startsWith('https://registry.npmjs.org/')) {
          return {
            ok: true,
            json: async () => ({
              time: { modified: new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000).toISOString() }, // 7 months ago
            }),
          };
        }
        // OSV.dev response - no vulns
        return { ok: true, json: async () => ({ vulns: [] }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'stale-server', severity: 'HIGH' }),
      ]));
    });

    it('should not identify stale package if last modified is within 6 months', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        if (url.startsWith('https://registry.npmjs.org/')) {
          return {
            ok: true,
            json: async () => ({
              time: { modified: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString() }, // 2 months ago
            }),
          };
        }
        // OSV.dev response - no vulns
        return { ok: true, json: async () => ({ vulns: [] }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'stale-server' }),
      ]));
    });

    it('should handle npm registry fetch errors gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        if (url.startsWith('https://registry.npmjs.org/')) {
          throw new Error('Network error');
        }
        // OSV.dev response - no vulns
        return { ok: true, json: async () => ({ vulns: [] }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual([]); // Expect no findings from npm registry if error
      // expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Network error fetching npm registry'));
    });
  });

  describe('OSV.dev integration', () => {
    it('should find critical vulnerabilities from OSV.dev', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
        if (url === 'https://api.osv.dev/v1/query') {
          return {
            ok: true,
            json: async () => ({
              vulns: [
                {
                  id: 'GHSA-abcd-1234-5678',
                  summary: 'Critical vulnerability in test-package',
                  details: 'Some critical details',
                  severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' }], // CVSS base score 9.8
                },
              ],
            }),
          };
        }
        // npm registry response - not stale
        return { ok: true, json: async () => ({ time: { modified: new Date().toISOString() } }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'known-vulnerability-critical',
          severity: 'CRITICAL',
          description: expect.stringContaining('Critical vulnerability'),
        }),
      ]));
    });

    it('should find high vulnerabilities from OSV.dev', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
        if (url === 'https://api.osv.dev/v1/query') {
          return {
            ok: true,
            json: async () => ({
              vulns: [
                {
                  id: 'GHSA-efgh-9012-3456',
                  summary: 'High vulnerability in test-package',
                  details: 'Some high details',
                  severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L' }], // CVSS base score 7.3
                },
              ],
            }),
          };
        }
        // npm registry response - not stale
        return { ok: true, json: async () => ({ time: { modified: new Date().toISOString() } }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'known-vulnerability-high',
          severity: 'HIGH',
          description: expect.stringContaining('High vulnerability'),
        }),
      ]));
    });

    it('should handle OSV.dev API timeout gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
        if (url === 'https://api.osv.dev/v1/query') {
          return new Promise(resolve => {}); // Never resolves, simulating timeout
        }
        // npm registry response - not stale
        return { ok: true, json: async () => ({ time: { modified: new Date().toISOString() } }) };
      }));

      const promise = scanPackageDeep(mockServer);
      vi.advanceTimersByTime(5001); // Advance past the 5-second timeout
      const findings = await promise;

      expect(findings).toEqual([]); // Expect no OSV findings due to timeout
      // expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('timed out'));
    });

    it('should handle OSV.dev API network errors gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
        if (url === 'https://api.osv.dev/v1/query') {
          throw new Error('OSV.dev network is down');
        }
        // npm registry response - not stale
        return { ok: true, json: async () => ({ time: { modified: new Date().toISOString() } }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual([]); // Expect no OSV findings due to network error
      // expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Error querying OSV.dev'));
    });

    it('should handle OSV.dev API non-ok response gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
        if (url === 'https://api.osv.dev/v1/query') {
          return { ok: false, statusText: 'Bad Request' };
        }
        // npm registry response - not stale
        return { ok: true, json: async () => ({ time: { modified: new Date().toISOString() } }) };
      }));

      const findings = await scanPackageDeep(mockServer);
      expect(findings).toEqual([]); // Expect no OSV findings due to non-ok response
      // expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('OSV.dev API request failed'));
    });
  });
});
