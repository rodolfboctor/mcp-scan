import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadYamlPolicy, validatePolicy, applyPolicy, SecurityPolicy } from '../../src/policy/engine.js';
import { ServerScanResult } from '../../src/types/scan-result.js';
import fs from 'fs';

describe('Policy Engine', () => {
    afterEach(() => {
        if (fs.existsSync('test-policy.yml')) fs.unlinkSync('test-policy.yml');
        if (fs.existsSync('invalid-policy.yml')) fs.unlinkSync('invalid-policy.yml');
    });

    it('1. No policy file -> default behavior', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'test', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const out = applyPolicy(results, null);
        expect(out[0].findings).toHaveLength(1);
    });

    it('2. Policy with skip rule -> matching findings suppressed', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'permission', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'allow-fs', scanner: 'permission', action: 'skip', match: { server_name: ['test'] } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(0);
    });

    it('3. Policy with block rule -> modifies to CRITICAL', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'network-egress', severity: 'MEDIUM', description: 'telemetry endpoint' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'no-telemetry', scanner: 'network', action: 'block', match: { category: ['telemetry'] } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('CRITICAL');
        expect(out[0].findings[0].description).toContain('[BLOCKED BY POLICY]');
    });

    it('4. Policy with warn rule -> finding reported but changed to MEDIUM', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'license-risk', severity: 'HIGH', description: 'unknown license' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'warn-license', scanner: 'license', action: 'warn', match: { license_type: ['unknown'] } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('MEDIUM');
        expect(out[0].findings[0].description).toContain('[WARN POLICY]');
    });

    it('5. Policy with override-severity -> severity changed in output', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'data-controls-pii', severity: 'HIGH', description: 'handles SSN' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'elevate-pii', scanner: 'data-controls', action: 'override-severity', severity: 'CRITICAL', match: { pii_types: ['SSN'] } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('CRITICAL');
    });

    it('6. Policy with multiple rules -> all applied in order', () => {
        const results: ServerScanResult[] = [{ 
            serverName: 'test', toolName: 't', configPath: '', 
            findings: [
                { id: 'permission', severity: 'HIGH', description: 'test' },
                { id: 'data-controls-pii', severity: 'HIGH', description: 'handles SSN' }
            ], 
            scanDurationMs: 0 
        }];
        const policy: SecurityPolicy = {
            version: 1, rules: [
                { id: 'skip-fs', scanner: 'permission', action: 'skip', match: { server_name: ['test'] } },
                { id: 'elevate-pii', scanner: 'data-controls', action: 'override-severity', severity: 'CRITICAL', match: { pii_types: ['SSN'] } }
            ]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(1);
        expect(out[0].findings[0].id).toBe('data-controls-pii');
        expect(out[0].findings[0].severity).toBe('CRITICAL');
    });

    it('7. Invalid policy YAML -> clear error message', () => {
        fs.writeFileSync('invalid-policy.yml', 'version: 1\nrules: [{}]');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const res = validatePolicy('invalid-policy.yml');
        expect(res).toBe(false);
        expect(consoleSpy.mock.calls[0][0]).toContain('Rule missing required fields');
    });

    it('8. Policy with unknown scanner name -> warning, not crash', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'permission', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'rule1', scanner: 'fake-scanner', action: 'skip', match: { server_name: ['test'] } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(1); // No crash, no match
    });

    it('9. validate command on valid policy -> success', () => {
        fs.writeFileSync('test-policy.yml', 'version: 1\nrules:\n  - id: test\n    scanner: perm\n    action: skip\n    match:\n      server_name: ["a"]');
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const res = validatePolicy('test-policy.yml');
        expect(res).toBe(true);
        expect(consoleSpy.mock.calls[0][0]).toContain('is valid');
    });

    it('10. validate command on invalid schema -> reports issues', () => {
        fs.writeFileSync('test-policy.yml', 'version: 1\nrules: [{}]');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const res = validatePolicy('test-policy.yml');
        expect(res).toBe(false);
        expect(consoleSpy.mock.calls[0][0]).toContain('Rule missing required fields');
    });
});