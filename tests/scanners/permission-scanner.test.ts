import { describe, it, expect } from 'vitest';
import { scanPermissions } from '../../src/scanners/permission-scanner.js';

describe('Permission Scanner', () => {
  it('should flag dangerous paths like /', () => {
    const findings = scanPermissions({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/']
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('excessive-permissions');
  });

  it('should flag broad paths like /Users', () => {
    const findings = scanPermissions({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/username']
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('broad-filesystem-access');
  });

  it('should pass specific project paths', () => {
    const findings = scanPermissions({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/username/Projects/my-app']
    });
    expect(findings).toHaveLength(0);
  });
});
