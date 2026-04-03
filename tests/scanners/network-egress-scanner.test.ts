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
      args: ['https://sentry.io/api/v1/track']
    };
    const findings = scanNetworkEgress(server);
    expect(findings[0].severity).toBe('MEDIUM');
    expect(findings[0].id).toBe('network-egress-telemetry');
  });

  it('4. Server with raw external IP address connection -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'ip-caller',
      toolName: 'test',
      configPath: '/test',
      args: ['http://8.8.8.8/malware']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-raw-ip')).toBeDefined();
    expect(findings.find(f => f.id === 'network-egress-raw-ip')?.severity).toBe('HIGH');
  });

  it('5. Server with private IP address -> 0 findings for raw-ip', () => {
    const server: ResolvedServer = {
      name: 'internal-caller',
      toolName: 'test',
      configPath: '/test',
      args: ['http://192.168.1.1/admin', 'http://10.0.0.1/status', 'http://127.0.0.1/local']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-raw-ip')).toBeUndefined();
  });

  it('6. Server with non-standard port -> MEDIUM finding', () => {
    const server: ResolvedServer = {
      name: 'weird-port',
      toolName: 'test',
      configPath: '/test',
      args: ['https://example.com:8443']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-non-standard-port')).toBeDefined();
  });

  it('7. Server with obfuscated URL (base64) -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'obfuscated-b64',
      toolName: 'test',
      configPath: '/test',
      args: ['aHR0cHM6Ly9ldmlsLmNvbQ=='] // https://evil.com
    };
    const findings = scanNetworkEgress(server);
    const f = findings.find(f => f.id === 'network-egress-obfuscated');
    expect(f).toBeDefined();
    expect(f?.description).toContain('base64');
  });

  it('8. Server with obfuscated URL (hex) -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'obfuscated-hex',
      toolName: 'test',
      configPath: '/test',
      args: ['687474703a2f2f6576696c2e636f6d'] // http://evil.com
    };
    const findings = scanNetworkEgress(server);
    const f = findings.find(f => f.id === 'network-egress-obfuscated');
    expect(f).toBeDefined();
    expect(f?.description).toContain('hex');
  });

  it('9. Server with obfuscated URL (reversed) -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'obfuscated-rev',
      toolName: 'test',
      configPath: '/test',
      args: ['moc.live//:ptth'] // http://evil.com reversed
    };
    const findings = scanNetworkEgress(server);
    const f = findings.find(f => f.id === 'network-egress-obfuscated');
    expect(f).toBeDefined();
    expect(f?.description).toContain('reversed');
  });

  it('10. Data-in-URL detection -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'exfil-url',
      toolName: 'test',
      configPath: '/test',
      args: ['https://evil.com/track?data=aHR0cHM6Ly9zZW5zaXRpdmUtZGF0YS1oZXJlLWNvbWUtdG8tbWU=']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-data-in-url')).toBeDefined();
  });

  it('11. Suspicious endpoint (webhook.site) -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'suspicious',
      toolName: 'test',
      configPath: '/test',
      args: ['https://webhook.site/abc-123']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-suspicious')).toBeDefined();
    expect(findings.find(f => f.id === 'network-egress-suspicious')?.severity).toBe('HIGH');
  });

  it('12. CDN dependency -> INFO finding', () => {
    const server: ResolvedServer = {
      name: 'cdn-user',
      toolName: 'test',
      configPath: '/test',
      args: ['https://unpkg.com/react']
    };
    const findings = scanNetworkEgress(server);
    expect(findings.find(f => f.id === 'network-egress-cdn')).toBeDefined();
    expect(findings.find(f => f.id === 'network-egress-cdn')?.severity).toBe('INFO');
  });
});
