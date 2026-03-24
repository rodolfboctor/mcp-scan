import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadCustomRules, evaluateCustomRules } from '../../src/utils/rule-engine.js';
import fs from 'fs';

vi.mock('fs');

describe('Rule Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadCustomRules', () => {
    it('should load JSON rules from the rules directory', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['rule1.json', 'not-a-rule.txt'] as any);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([
        {
          id: 'custom-rule-1',
          severity: 'HIGH',
          description: 'Test rule',
          pattern: 'malicious-string',
          target: 'args'
        }
      ]));

      const rules = loadCustomRules();
      expect(rules).toHaveLength(1);
      expect(rules[0].id).toBe('custom-rule-1');
    });

    it('should handle missing rules directory gracefully', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const rules = loadCustomRules();
      expect(rules).toHaveLength(0);
    });
  });

  describe('evaluateCustomRules', () => {
    it('should flag matching rules in args', () => {
      const server = { name: 's1', toolName: 't1', configPath: 'p1', command: 'node', args: ['--test', 'malicious-string'] };
      const rules = [{
        id: 'custom-rule-1',
        severity: 'HIGH' as const,
        description: 'Test rule',
        pattern: 'malicious-string',
        target: 'args' as const
      }];

      const findings = evaluateCustomRules(server, rules);
      expect(findings).toHaveLength(1);
      expect(findings[0].id).toBe('custom-rule-1');
    });

    it('should flag matching rules in env', () => {
      const server = { name: 's1', toolName: 't1', configPath: 'p1', command: 'node', env: { BAD_VAR: 'secret' } };
      const rules = [{
        id: 'custom-env-rule',
        severity: 'CRITICAL' as const,
        description: 'Test env rule',
        pattern: 'BAD_VAR',
        target: 'env' as const
      }];

      const findings = evaluateCustomRules(server, rules);
      expect(findings).toHaveLength(1);
      expect(findings[0].id).toBe('custom-env-rule');
    });

    it('should flag matching rules in command', () => {
      const server = { name: 's1', toolName: 't1', configPath: 'p1', command: 'evil-binary' };
      const rules = [{
        id: 'custom-cmd-rule',
        severity: 'HIGH' as const,
        description: 'Test cmd rule',
        pattern: 'evil-binary',
        target: 'command' as const
      }];

      const findings = evaluateCustomRules(server, rules);
      expect(findings).toHaveLength(1);
      expect(findings[0].id).toBe('custom-cmd-rule');
    });

    it('should not flag if pattern does not match', () => {
      const server = { name: 's1', toolName: 't1', configPath: 'p1', command: 'node', args: ['clean'] };
      const rules = [{
        id: 'custom-rule-1',
        severity: 'HIGH' as const,
        description: 'Test rule',
        pattern: 'malicious-string',
        target: 'args' as const
      }];

      const findings = evaluateCustomRules(server, rules);
      expect(findings).toHaveLength(0);
    });
  });
});
