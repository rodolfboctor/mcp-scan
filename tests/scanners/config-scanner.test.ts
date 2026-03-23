import { describe, it, expect } from 'vitest';
import { scanConfig } from '../../src/scanners/config-scanner.js';

describe('Config Scanner', () => {
  it('should detect shell injection risks', () => {
    const findings = scanConfig({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server', '${rm -rf /}']
    });
    const injectionFinding = findings.find(f => f.id === 'shell-injection-risk');
    expect(injectionFinding).toBeDefined();
  });

  it('should detect missing environment variables', () => {
    const findings = scanConfig({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args: ['-y', 'server', '$MISSING_VAR'],
      env: {}
    });
    const missingVarFinding = findings.find(f => f.id === 'missing-env-var');
    expect(missingVarFinding).toBeDefined();
  });

  it('should detect large argument lists', () => {
    const args = Array(25).fill('arg');
    const findings = scanConfig({
      name: 'test', toolName: 't', configPath: 'p', command: 'npx',
      args
    });
    const largeArgFinding = findings.find(f => f.id === 'large-arg-list');
    expect(largeArgFinding).toBeDefined();
  });
});
