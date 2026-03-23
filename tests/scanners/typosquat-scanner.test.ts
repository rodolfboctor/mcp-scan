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

  it('should flag homoglyph substitutions', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server-g1thub']
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].description).toContain('homoglyph substitution');
  });

  it('should flag missing hyphens', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'servergithub']
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].description).toContain('missing or extra hyphen');
  });

  it('should pass exact official matches', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github']
    });
    expect(findings).toHaveLength(0);
  });

  it('should pass trusted community matches', () => {
    const findings = scanTyposquat({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'slack-mcp']
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
