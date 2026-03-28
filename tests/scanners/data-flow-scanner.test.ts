import { describe, it, expect } from 'vitest';
import { scanDataFlow } from '../../src/scanners/data-flow-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';

describe('Data Flow Scanner', () => {
  it('1. Clean server with no data flow issues -> 0 findings', () => {
    const server: ResolvedServer = {
      name: 'clean-server',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'math_add', description: 'adds numbers' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings).toHaveLength(0);
  });

  it('2. Read-only server (filesystem, no network) -> 0 findings', () => {
    const server: ResolvedServer = {
      name: 'read-only',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'read_file', handler: 'fs.readFileSync(path)' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings).toHaveLength(0);
  });

  it('3. Network-only server (API calls, no local reads) -> 0 findings', () => {
    const server: ResolvedServer = {
      name: 'net-only',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'fetch_weather', handler: 'fetch("http://weather")' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings).toHaveLength(0);
  });

  it('4. Read + network combo (filesystem read + HTTP POST) -> 1+ findings', () => {
    const server: ResolvedServer = {
      name: 'exfil',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'search_and_send', description: 'read_file and http post' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].id).toBe('data-exfiltration-risk');
    expect(findings[0].severity).toBe('HIGH');
  });

  it('5. Credential relay (env var -> external API) -> CRITICAL finding', () => {
    const server: ResolvedServer = {
      name: 'relay',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'relay', params: 'process.env.SECRET', action: 'fetch(api)' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings.find(f => f.id === 'credential-relay-risk')).toBeDefined();
    expect(findings.find(f => f.id === 'credential-relay-risk')?.severity).toBe('CRITICAL');
  });

  it('6. Cross-server data flow -> finding with cross-reference', () => {
    const server: ResolvedServer = {
      name: 'server-a',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'send_to_b', description: 'sends to server-b' }]
      }
    };
    const serverB: ResolvedServer = { name: 'server-b', toolName: 'test', configPath: '/test' };
    const findings = scanDataFlow(server, [server, serverB]);
    expect(findings.find(f => f.id === 'cross-server-flow')).toBeDefined();
  });

  it('7. Sanitized flow (data transformed before sending) -> 0 findings (false positive check)', () => {
    const server: ResolvedServer = {
      name: 'sanitized',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'safe_send', description: 'read_file, sanitize data, fetch http' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings.find(f => f.id === 'data-exfiltration-risk')).toBeUndefined();
  });

  it('8. Temp file without cleanup -> MEDIUM finding', () => {
    const server: ResolvedServer = {
      name: 'temp-leak',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'cache', description: 'write to /tmp' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings.find(f => f.id === 'temp-storage-risk')).toBeDefined();
    expect(findings.find(f => f.id === 'temp-storage-risk')?.severity).toBe('MEDIUM');
  });

  it('9. Malformed tool definition -> graceful handling, no crash', () => {
    const server: ResolvedServer = {
      name: 'malformed',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [null, undefined, 42, { name: 'valid' }]
      }
    };
    expect(() => scanDataFlow(server)).not.toThrow();
  });

  it('10. Empty tool list -> 0 findings, no crash', () => {
    const server: ResolvedServer = {
      name: 'empty',
      toolName: 'test',
      configPath: '/test'
    };
    const findings = scanDataFlow(server);
    expect(findings).toHaveLength(0);
  });

  it('11. Server with 50+ tools -> completes in < 2 seconds', () => {
    const tools = Array.from({ length: 50 }).map((_, i) => ({
      name: `tool_${i}`,
      desc: 'read_file and fetch network'
    }));
    const server: ResolvedServer = {
      name: 'big',
      toolName: 'test',
      configPath: '/test',
      schema: { tools }
    };
    
    const start = Date.now();
    const findings = scanDataFlow(server);
    const end = Date.now();
    
    expect(end - start).toBeLessThan(2000);
    expect(findings.length).toBeGreaterThan(0);
  });
});
