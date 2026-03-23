import { describe, it, expect } from 'vitest';
import { scanTyposquat } from '../../src/scanners/typosquat-scanner.js';

describe('Typosquat Scanner', () => {
  it('should flag slightly misspelled official packages', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server-githb']
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('typosquat-detection');
  });

  it('should pass exact official matches', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github']
    });
    expect(findings).toHaveLength(0);
  });

  it('should pass completely unrelated packages', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'my-custom-internal-server']
    });
    expect(findings).toHaveLength(0);
  });
});
