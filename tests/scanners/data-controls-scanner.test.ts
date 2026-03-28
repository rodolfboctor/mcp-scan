import { describe, it, expect } from 'vitest';
import { scanDataControls } from '../../src/scanners/data-controls-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';

describe('Data Controls Scanner', () => {
  it('1. Server with no PII handling -> clean report', () => {
    const server: ResolvedServer = {
      name: 'clean', toolName: 'test', configPath: '/test',
      schema: { description: 'basic math operations, expire cache, delete, encrypt data' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-pii')).toBeUndefined();
    expect(findings.find(f => f.id === 'data-controls-retention-gap')).toBeUndefined();
    expect(findings.find(f => f.id === 'data-controls-deletion-gap')).toBeUndefined();
    expect(findings.find(f => f.id === 'data-controls-encryption-gap')).toBeUndefined();
  });

  it('2. Server handling email addresses -> PII detected', () => {
    const server: ResolvedServer = {
      name: 'email-tool', toolName: 'test', configPath: '/test',
      schema: { description: 'fetches user email' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-pii')).toBeDefined();
    expect(findings.find(f => f.id === 'data-controls-pii')?.severity).toBe('HIGH');
  });

  it('3. Server handling credit card numbers -> PII detected, CRITICAL', () => {
    const server: ResolvedServer = {
      name: 'payment-tool', toolName: 'test', configPath: '/test',
      schema: { param: 'credit card' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-pii')?.severity).toBe('CRITICAL');
  });

  it('4. Server with TTL/expiry config -> retention policy detected', () => {
    const server: ResolvedServer = {
      name: 'cache', toolName: 'test', configPath: '/test',
      env: { CACHE_TTL: '3600' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-retention-gap')).toBeUndefined();
  });

  it('5. Server with no retention config -> gap flagged', () => {
    const server: ResolvedServer = {
      name: 'basic', toolName: 'test', configPath: '/test'
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-retention-gap')).toBeDefined();
  });

  it('6. Server logging prompts -> flagged', () => {
    const server: ResolvedServer = {
      name: 'logger', toolName: 'test', configPath: '/test',
      schema: { description: 'log user prompt' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-prompt-logging')).toBeDefined();
  });

  it('7. Server with encryption config -> positive detection', () => {
    const server: ResolvedServer = {
      name: 'secure', toolName: 'test', configPath: '/test',
      env: { DB_ENCRYPT: 'true' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-encryption-gap')).toBeUndefined();
  });

  it('8. Retention scan with old temp files -> findings generated', () => {
    const server: ResolvedServer = {
      name: 'retention-test', toolName: 'test', configPath: '/test'
    };
    const findings = scanDataControls(server, true);
    expect(findings.find(f => f.id === 'data-controls-old-temp-files')).toBeDefined();
  });

  it('12. Server with 0 tools -> graceful handling', () => {
    const server: ResolvedServer = { name: 'empty', toolName: 'test', configPath: '/test' };
    expect(() => scanDataControls(server)).not.toThrow();
  });
});