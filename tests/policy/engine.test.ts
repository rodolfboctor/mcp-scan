import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadYamlPolicy, validatePolicy, applyPolicy, SecurityPolicy } from '../../src/policy/engine.js';
import { ServerScanResult } from '../../src/types/scan-result.js';
import fs from 'fs';

describe('Policy Engine', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        if (fs.existsSync('test-policy.yml')) fs.unlinkSync('test-policy.yml');
        if (fs.existsSync('invalid-policy.yml')) fs.unlinkSync('invalid-policy.yml');
    });

    it('1. No policy file -> default behavior', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'test', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const out = applyPolicy(results, null);
        expect(out[0].findings).toHaveLength(1);
    });

    it('2. Policy with skip rule by finding_id -> matching findings suppressed', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'permission-risk', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'allow-fs', action: 'skip', match: { finding_id: 'permission-risk', server_name: 'test' } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(0);
    });

    it('3. Policy with block rule by category -> modifies to CRITICAL', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'network-egress', severity: 'MEDIUM', description: 'telemetry endpoint' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'no-telemetry', action: 'block', match: { category: 'telemetry' } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('CRITICAL');
        expect(out[0].findings[0].description).toContain('[POLICY BLOCK]');
    });

    it('4. Policy with warn rule by severity -> finding reported but changed to MEDIUM', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'license-risk', severity: 'HIGH', description: 'unknown license' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'warn-high', action: 'warn', match: { severity: 'HIGH' } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('MEDIUM');
        expect(out[0].findings[0].description).toContain('[POLICY WARN]');
    });

    it('5. Policy with override-severity -> severity changed in output', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'data-controls-pii', severity: 'HIGH', description: 'handles SSN' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'elevate-pii', action: 'override-severity', severity: 'critical', match: { finding_id: 'data-controls-pii' } }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings[0].severity).toBe('CRITICAL');
    });

    it('6. Policy with multiple rules -> all applied in order', () => {
        const results: ServerScanResult[] = [{ 
            serverName: 'test', toolName: 't', configPath: '', 
            findings: [
                { id: 'permission-risk', severity: 'HIGH', description: 'test' },
                { id: 'data-controls-pii', severity: 'HIGH', description: 'handles SSN' }
            ], 
            scanDurationMs: 0 
        }];
        const policy: SecurityPolicy = {
            version: 1, rules: [
                { id: 'skip-fs', action: 'skip', match: { finding_id: 'permission-risk' } },
                { id: 'elevate-pii', action: 'override-severity', severity: 'critical', match: { finding_id: 'data-controls-pii' } }
            ]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(1);
        expect(out[0].findings[0].id).toBe('data-controls-pii');
        expect(out[0].findings[0].severity).toBe('CRITICAL');
    });

    it('7. Invalid policy YAML schema -> reports errors', () => {
        fs.writeFileSync('invalid-policy.yml', 'version: 2\nrules: []');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const res = validatePolicy('invalid-policy.yml');
        expect(res).toBe(false);
        expect(consoleSpy.mock.calls[0][0]).toContain('Invalid policy schema');
    });

    it('8. Policy match by scanner prefix -> success', () => {
        const results: ServerScanResult[] = [{ serverName: 'test', toolName: 't', configPath: '', findings: [{ id: 'data-flow-exfiltration', severity: 'HIGH', description: 'test' }], scanDurationMs: 0 }];
        const policy: SecurityPolicy = {
            version: 1, rules: [{ id: 'skip-flow', scanner: 'data-flow', action: 'skip' }]
        };
        const out = applyPolicy(results, policy);
        expect(out[0].findings).toHaveLength(0);
    });
});
