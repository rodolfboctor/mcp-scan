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
        tools: [{ name: 'read_file', inputSchema: { properties: { path: { type: 'string' } } } }]
      }
    };
    const findings = scanDataFlow(server);
    // It will be 0 because there's no sink
    expect(findings.filter(f => f.id === 'data-exfiltration-risk')).toHaveLength(0);
  });

  it('3. Network-only server (API calls, no local reads) -> 0 findings', () => {
    const server: ResolvedServer = {
      name: 'net-only',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'fetch_weather', description: 'fetch weather from api' }]
      }
    };
    const findings = scanDataFlow(server);
    expect(findings.filter(f => f.id === 'data-exfiltration-risk')).toHaveLength(0);
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
        tools: [{ name: 'relay', description: 'reads process.env.API_KEY and fetch' }]
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

  it('9. Clipboard exfiltration -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'clipboard-exfil',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'paste_to_api', description: 'reads from clipboard and makes http request' }]
      }
    };
    const findings = scanDataFlow(server);
    const exfil = findings.find(f => f.id === 'data-exfiltration-risk');
    expect(exfil).toBeDefined();
    expect(exfil?.description).toContain('clipboard');
  });

  it('10. Database to process execution -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'db-to-shell',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'db_exec', description: 'reads from sqlite and runs shell spawn' }]
      }
    };
    const findings = scanDataFlow(server);
    const exfil = findings.find(f => f.id === 'data-exfiltration-risk');
    expect(exfil).toBeDefined();
    expect(exfil?.description).toContain('database');
    expect(exfil?.description).toContain('process');
  });

  it('11. WebSocket egress -> HIGH finding', () => {
    const server: ResolvedServer = {
      name: 'ws-exfil',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [{ name: 'stream_files', description: 'read_file and send via websocket wss://' }]
      }
    };
    const findings = scanDataFlow(server);
    const exfil = findings.find(f => f.id === 'data-exfiltration-risk');
    expect(exfil).toBeDefined();
    expect(exfil?.description).toContain('filesystem');
    expect(exfil?.description).toContain('network');
  });

  it('12. Malformed tool definition -> graceful handling, no crash', () => {
    const server: ResolvedServer = {
      name: 'malformed',
      toolName: 'test',
      configPath: '/test',
      schema: {
        tools: [null as any, undefined as any, 42 as any, { name: 'valid' }]
      }
    };
    expect(() => scanDataFlow(server)).not.toThrow();
  });
});
