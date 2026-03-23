import { describe, it, expect } from 'vitest';
import { scanSecrets } from '../../src/scanners/secret-scanner.js';

describe('Secret Scanner', () => {
  it('should detect GitHub tokens', () => {
    const findings = scanSecrets({
      name: 'test', toolName: 't', configPath: 'p', command: 'cmd',
      env: { TOKEN: 'ghp_abcdefghijklmnopqrstuvwxyz1234567890' }
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('exposed-secret');
  });

  it('should detect AWS keys', () => {
    const findings = scanSecrets({
      name: 'test', toolName: 't', configPath: 'p', command: 'cmd',
      env: { KEY: 'AKIAIOSFODNN7EXAMPLE' }
    });
    expect(findings).toHaveLength(1);
  });

  it('should pass safe strings', () => {
    const findings = scanSecrets({
      name: 'test', toolName: 't', configPath: 'p', command: 'cmd',
      env: { NORMAL_VAR: 'just-a-value', ANOTHER: '12345' }
    });
    expect(findings).toHaveLength(0);
  });
});
