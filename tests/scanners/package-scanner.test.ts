import { describe, it, expect, vi } from 'vitest';
import { scanPackageDeep } from '../../src/scanners/package-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';
import { FindingId } from '../../src/types/scan-result.js';
import { logger } from '../../src/utils/logger.js';

// Mocking global fetch for OSV.dev and npm registry tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create mock fetch response
const createMockFetchResponse = (ok: boolean, json: any, status: number = ok ? 200 : 404) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(json),
  text: vi.fn().mockResolvedValue(JSON.stringify(json)),
  headers: new Headers(),
  statusText: ok ? 'OK' : 'Not Found',
});

// Mock vuln-vects for CVSS parsing
vi.mock('vuln-vects', () => ({
  parseCvssVector: vi.fn((score: string) => {
    if (score === 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H') return { baseScore: 9.8 };
    if (score === 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L') return { baseScore: 7.5 };
    if (score === 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L') return { baseScore: 5.0 }; // Low severity example
    throw new Error('Invalid CVSS vector');
  }),
}));

// Mock logger to avoid console output during tests
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    detail: vi.fn(),
    log: vi.fn(),
    brand: vi.fn(),
    isVerbose: true, // Set to true to allow detail logs
  },
}));

describe('Package Scanner - OSV.dev integration', () => {
  const mockServer = (packageName: string, command: string = 'npx'): ResolvedServer => ({
    name: `${packageName}-server`,
    toolName: 'mock-tool',
    configPath: `/path/to/config.json`,
    command: command,
    args: [packageName],
    schema: {},
    description: '',
    env: {},
    disabled: false,
  });

  beforeEach(() => {
    mockFetch.mockClear();
    // Reset mocks for logger and other potential dependencies
    vi.clearAllMocks();
    // Ensure fetch is mocked for each test
    mockFetch.mockImplementation(async (url, options) => {
      if (url === 'https://api.osv.dev/v1/query') {
        const body = JSON.parse(options.body as string);
        const packageName = body.package.name;

        if (packageName === 'vulnerable-critical') {
          return createMockFetchResponse(true, {
            vulns: [{
              id: 'CVE-2023-1234',
              summary: 'A critical vulnerability',
              details: 'Details of the critical vulnerability.',
              severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' }],
            }],
          });
        } else if (packageName === 'vulnerable-high') {
          return createMockFetchResponse(true, {
            vulns: [{
              id: 'CVE-2023-5678',
              summary: 'A high vulnerability',
              details: 'Details of the high vulnerability.',
              severity: [{ type: 'CVSS_V3', score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L' }],
            }],
          });
        } else if (packageName === 'no-vulns') {
          return createMockFetchResponse(true, { vulns: [] });
        } else if (packageName === 'error-package') {
          return createMockFetchResponse(false, {}, 500);
        } else if (packageName === 'timeout-package') {
          // Mock fetch to resolve after 4 seconds, which is less than the 5-second timeout
          return new Promise((resolve) => setTimeout(() => resolve(createMockFetchResponse(true, { vulns: [] })), 4000));
        }
      } else if (url.startsWith('https://registry.npmjs.org/')) {
         // Mock npm registry response
         const packageName = url.split('/').pop();
         if (packageName === 'stale-package') {
            return createMockFetchResponse(true, { time: { modified: new Date(Date.now() - 7 * 30 * 24 * 60 * 60 * 1000).toISOString() } }); // Modified 7 months ago
         } else if (packageName === 'fresh-package') {
             return createMockFetchResponse(true, { time: { modified: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString() } }); // Modified 2 months ago
         } else if (packageName === 'npm-error') {
             return createMockFetchResponse(false, {}, 404);
         }
      }
      return createMockFetchResponse(false, {}, 404); // Default not found
    });
  });

  it('should return empty findings if package name cannot be extracted', async () => {
    const server = { ...mockServer('some-pkg'), command: 'some-other-command' }; // Command that doesn't extract package name
    const findings = await scanPackageDeep(server);
    expect(findings).toEqual([]);
  });

  describe('npm registry lookup', () => {
    it('should detect stale package if not updated in 6+ months', async () => {
      const server = mockServer('stale-package');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'stale-server')).toBe(true);
    });

    it('should not detect package as stale if updated recently', async () => {
      const server = mockServer('fresh-package');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'stale-server')).toBe(false);
    });

    it('should handle npm registry errors gracefully', async () => {
      const server = mockServer('npm-error');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'stale-server')).toBe(false); // Should not error out
    });
  });

  describe('OSV.dev integration', () => {
    it('should find critical vulnerabilities from OSV.dev', async () => {
      const server = mockServer('vulnerable-critical');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-critical')).toBe(true);
    });

    it('should find high vulnerabilities from OSV.dev', async () => {
      const server = mockServer('vulnerable-high');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-high')).toBe(true);
    });

    it('should handle OSV.dev API timeout gracefully', async () => {
      const server = mockServer('timeout-package');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-critical' || f.id === 'known-vulnerability-high')).toBe(false);
      // Ensure the warning about timeout is NOT called, as it should not time out now
      expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('OSV.dev API request for timeout-package timed out'));
    });

    it('should handle OSV.dev API network errors gracefully', async () => {
      const server = mockServer('error-package');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-critical' || f.id === 'known-vulnerability-high')).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('OSV.dev API request failed for error-package'));
    });

    it('should handle OSV.dev API non-ok response gracefully', async () => {
      const server = mockServer('non-ok-response'); // This will hit the default 404 in mockFetch
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-critical' || f.id === 'known-vulnerability-high')).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('OSV.dev API request failed for non-ok-response'));
    });

     it('should return no findings if OSV.dev returns no vulnerabilities', async () => {
      const server = mockServer('no-vulns');
      const findings = await scanPackageDeep(server);
      expect(findings.some(f => f.id === 'known-vulnerability-critical' || f.id === 'known-vulnerability-high')).toBe(false);
    });
  });
});
