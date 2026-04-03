import * as core from '@actions/core';
import { runScan } from '../../src/lib.js';
import { writeSarifReport } from '../../src/utils/sarif-reporter.js';
import path from 'path';
import { readFileSync } from 'fs';

async function run() {
  try {
    const configPath = core.getInput('config');
    const severity = core.getInput('severity') || 'high';
    const failOnFindings = core.getInput('fail-on-findings') === 'true';
    const sarifOutput = core.getInput('sarif-output') || 'mcp-scan-results.sarif';

    const pkgUrl = new URL('../../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8'));

    core.info(`Running mcp-scan v${pkg.version}...`);

    const options: any = {
      silent: true,
      severity: severity,
      version: pkg.version,
      sarif: sarifOutput
    };

    if (configPath) {
      options.config = configPath;
      core.info(`Using config: ${configPath}`);
    }

    const report = await runScan(options);

    core.setOutput('findings-count', report.results.reduce((acc, r) => acc + r.findings.length, 0));
    core.setOutput('critical-count', report.criticalCount);
    core.setOutput('high-count', report.highCount);
    core.setOutput('medium-count', report.mediumCount);
    core.setOutput('low-count', report.lowCount);
    core.setOutput('info-count', report.infoCount);

    if (sarifOutput) {
      const resolvedSarifPath = path.resolve(process.cwd(), sarifOutput);
      core.info(`SARIF report written to ${resolvedSarifPath}`);
      core.setOutput('sarif-path', resolvedSarifPath);
    }

    core.info(`Scan complete. ${report.criticalCount} critical, ${report.highCount} high findings.`);

    if (failOnFindings && (report.criticalCount > 0 || report.highCount > 0)) {
       core.setFailed(`Scan failed with ${report.criticalCount} critical and ${report.highCount} high findings.`);
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
