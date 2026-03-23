import { describe, it, expect } from 'vitest';
import { scanTransport } from '../../src/scanners/transport-scanner.js';

describe('Transport Scanner', () => {
  it('should flag HTTP URLs with no auth', () => {
    const findings = scanTransport({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server', 'http://example.com']
    });
    expect(findings.some(f => f.id === 'http-transport-no-auth')).toBe(true);
  });

  it('should pass HTTP URLs with auth in env', () => {
    const findings = scanTransport({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server', 'http://example.com'],
      env: { API_KEY: 'some-key' }
    });
    expect(findings.some(f => f.id === 'http-transport-no-auth')).toBe(false);
  });

  it('should flag deprecated SSE transport', () => {
    const findings = scanTransport({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server', '--transport=sse']
    });
    expect(findings.some(f => f.id === 'outdated-transport')).toBe(true);
  });
});
