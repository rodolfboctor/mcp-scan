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

  it('4. Server with IBAN -> PII detected, HIGH', () => {
    const server: ResolvedServer = {
      name: 'bank-tool', toolName: 'test', configPath: '/test',
      args: ['DE12345678901234567890']
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-pii')).toBeDefined();
    expect(findings.find(f => f.id === 'data-controls-pii')?.description).toContain('IBAN');
  });

  it('5. Server with API Key -> PII detected, CRITICAL', () => {
    const server: ResolvedServer = {
      name: 'api-tool', toolName: 'test', configPath: '/test',
      args: ['AKIA1234567890ABCDEFGHIJ']
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-pii')?.severity).toBe('CRITICAL');
  });

  it('6. Server with TTL/expiry config -> retention policy detected', () => {
    const server: ResolvedServer = {
      name: 'cache', toolName: 'test', configPath: '/test',
      description: 'collects email',
      env: { CACHE_TTL: '3600' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-retention-gap')).toBeUndefined();
  });

  it('7. Server handling PII with no retention config -> gap flagged', () => {
    const server: ResolvedServer = {
      name: 'basic', toolName: 'test', configPath: '/test',
      description: 'collects user email addresses'
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-retention-gap')).toBeDefined();
  });

  it('8. Server logging prompts -> flagged', () => {
    const server: ResolvedServer = {
      name: 'logger', toolName: 'test', configPath: '/test',
      schema: { description: 'log user prompt' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-prompt-logging')).toBeDefined();
  });

  it('9. Server with encryption config -> positive detection', () => {
    const server: ResolvedServer = {
      name: 'secure', toolName: 'test', configPath: '/test',
      description: 'handles email',
      env: { DB_ENCRYPT: 'true' }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-encryption-gap')).toBeUndefined();
  });

  it('10. Data minimization risk -> flagged', () => {
    const server: ResolvedServer = {
      name: 'over-collector', toolName: 'test', configPath: '/test',
      schema: {
        tools: [{
          name: 'get_user',
          description: 'gets user pii',
          inputSchema: {
            properties: {
              p1: { type: 'string' }, p2: { type: 'string' }, p3: { type: 'string' },
              p4: { type: 'string' }, p5: { type: 'string' }, p6: { type: 'string' },
              p7: { type: 'string' }, p8: { type: 'string' }, p9: { type: 'string' },
              p10: { type: 'string' }, p11: { type: 'string' }
            }
          }
        }]
      }
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-minimization-risk')).toBeDefined();
  });

  it('11. Deletion capability detected -> gap cleared', () => {
    const server: ResolvedServer = {
      name: 'deleter', toolName: 'test', configPath: '/test',
      description: 'collects email and allows to delete account'
    };
    const findings = scanDataControls(server);
    expect(findings.find(f => f.id === 'data-controls-deletion-gap')).toBeUndefined();
  });

  it('12. Malformed tools -> graceful handling', () => {
    const server: ResolvedServer = { name: 'empty', toolName: 'test', configPath: '/test' };
    expect(() => scanDataControls(server)).not.toThrow();
  });
});
