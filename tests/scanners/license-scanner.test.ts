import { describe, it, expect } from 'vitest';
import { scanLicense } from '../../src/scanners/license-scanner.js';

describe('license-scanner', () => {
  it('should flag copyleft licenses as MEDIUM', () => {
    const metadata = {
      source: 'npm' as const,
      packageName: 'test-pkg',
      license: 'GPL-3.0'
    };
    const findings = scanLicense(metadata);
    expect(findings.some(f => f.id === 'license-risk' && f.severity === 'MEDIUM')).toBe(true);
  });

  it('should flag unlicensed packages as HIGH', () => {
    const metadata = {
      source: 'npm' as const,
      packageName: 'test-pkg',
      license: 'UNLICENSED'
    };
    const findings = scanLicense(metadata);
    expect(findings.some(f => f.id === 'license-risk' && f.severity === 'HIGH')).toBe(true);
  });

  it('should flag missing license as HIGH', () => {
    const metadata = {
      source: 'npm' as const,
      packageName: 'test-pkg'
    };
    const findings = scanLicense(metadata);
    expect(findings.some(f => f.id === 'license-risk' && f.severity === 'HIGH')).toBe(true);
  });

  it('should allow permissive licenses', () => {
    const metadata = {
      source: 'npm' as const,
      packageName: 'test-pkg',
      license: 'MIT'
    };
    const findings = scanLicense(metadata);
    expect(findings).toHaveLength(0);
  });

  it('should flag unknown licenses as LOW', () => {
    const metadata = {
      source: 'npm' as const,
      packageName: 'test-pkg',
      license: 'Custom-License-123'
    };
    const findings = scanLicense(metadata);
    expect(findings.some(f => f.id === 'license-risk' && f.severity === 'LOW')).toBe(true);
  });
});
