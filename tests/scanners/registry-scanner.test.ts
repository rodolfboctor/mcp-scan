import { describe, it, expect } from 'vitest';
import { scanRegistry } from '../../src/scanners/registry-scanner.js';

describe('Registry Scanner', () => {
  it('should flag known malicious packages', () => {
    const findings = scanRegistry({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'postmark-mcp']
    });
    expect(findings.some(f => f.id === 'known-malicious')).toBe(true);
  });

  it('should identify official servers', () => {
    const findings = scanRegistry({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite']
    });
    expect(findings.some(f => f.id === 'official-server')).toBe(true);
  });

  it('should identify trusted community servers', () => {
    const findings = scanRegistry({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'slack-mcp']
    });
    expect(findings.some(f => f.id === 'trusted-community-server')).toBe(true);
  });

  it('should flag unverified sources', () => {
    const findings = scanRegistry({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'some-random-mcp-package']
    });
    expect(findings.some(f => f.id === 'unverified-source')).toBe(true);
  });
});
