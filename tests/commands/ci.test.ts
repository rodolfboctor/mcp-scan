import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import path from 'path';

const CLI_PATH = path.resolve('./dist/index.js');
const VULNERABLE_FIXTURE = path.resolve('./tests/fixtures/vulnerable-config.json');
const VALID_FIXTURE = path.resolve('./tests/fixtures/valid-config.json');

describe('CI Command Integration', () => {
  it('should exit with code 1 and output JSON when --ci is used and critical/high findings exist', async () => {
    let error;
    try {
      await execa(`node ${CLI_PATH} scan --ci --config ${VULNERABLE_FIXTURE}`, { shell: true, stdin: 'ignore' });
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error.exitCode).toBe(1);

    const stdout = error.stdout;
    expect(() => JSON.parse(stdout)).not.toThrow(); // Should be valid JSON
    const report = JSON.parse(stdout);
    expect(report.criticalCount).toBeGreaterThan(0);
    expect(report.highCount).toBeGreaterThan(0);
    }, 30000); // Increased timeout for execa

    it('should exit with code 0 and output JSON when --ci is used and no critical/high findings exist', async () => {
    const { stdout, exitCode } = await execa(`node ${CLI_PATH} scan --ci --config ${VALID_FIXTURE}`, { shell: true, stdin: 'ignore' });

    expect(exitCode).toBe(0);
    expect(() => JSON.parse(stdout)).not.toThrow(); // Should be valid JSON
    const report = JSON.parse(stdout);
    expect(report.criticalCount).toBe(0);
    expect(report.highCount).toBe(0);
    }, 30000); // Increased timeout for execa

    it('should force --json output when --ci is used', async () => {
    // Run without explicitly setting --json
    let error;
    try {
      await execa(`node ${CLI_PATH} scan --ci --config ${VULNERABLE_FIXTURE}`, { shell: true, stdin: 'ignore' });
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error.exitCode).toBe(1);

    const stdout = error.stdout;
    expect(() => JSON.parse(stdout)).not.toThrow(); // Should be valid JSON
    }, 30000);
});
