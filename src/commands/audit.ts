import { runScan } from './scan.js';
import { scanPackageDeep } from '../scanners/package-scanner.js';
import { printReport } from '../utils/reporter.js';
import { createSpinner } from '../utils/spinner.js';
import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { readAuditLog } from '../utils/audit-logger.js';
import Table from 'cli-table3';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';

export async function runAudit(serverName?: string) {
  if (!serverName) {
    showAuditHistory();
    return;
  }

  const spinner = createSpinner(`Deep auditing server '${serverName}'...`).start();

  const tools = await detectTools();
  let targetServer = null;

  for (const tool of tools) {
    if (!tool.exists) continue;
    const config = parseConfig(tool.configPath);
    if (!config) continue;
    
    const servers = extractServers(tool.name, tool.configPath, config);
    const found = servers.find(s => s.name === serverName);
    if (found) {
      targetServer = found;
      break;
    }
  }

  if (!targetServer) {
    spinner.fail(`Server '${serverName}' not found in any detected configs.`);
    process.exit(1);
  }

  // Run normal scan first for this specific server
  const baseReport = await runScan({ silent: true });
  const serverResult = baseReport.results.find(r => r.serverName === serverName);

  if (!serverResult) {
     spinner.fail(`Failed to analyze server '${serverName}'.`);
     process.exit(1);
  }

  // Run deep checks
  spinner.text = `Checking registry health for '${serverName}'...`;
  const deepFindings = await scanPackageDeep(targetServer);
  
  serverResult.findings.push(...deepFindings);
  for (const f of deepFindings) {
    if (f.severity === 'CRITICAL') baseReport.criticalCount++;
    else if (f.severity === 'HIGH') baseReport.highCount++;
  }

  spinner.succeed(`Audit complete for '${serverName}'`);

  printReport({
    ...baseReport,
    results: [serverResult],
    totalScanned: 1
  });

  if (baseReport.criticalCount > 0 || baseReport.highCount > 0) {
    process.exit(1);
  }
}

function showAuditHistory() {
  const entries = readAuditLog(20);
  
  if (entries.length === 0) {
    logger.info('No scan history found.');
    return;
  }

  logger.brand('Recent Scan History:');
  
  const table = new Table({
    head: ['Timestamp', 'Servers', 'Findings (C/H/M/L)', 'Duration'],
    style: { head: ['cyan'] }
  });

  for (const entry of entries) {
    const findings = entry.findings;
    const findingsStr = [
      chalk.red(findings.critical),
      chalk.hex('#F0883E')(findings.high),
      chalk.yellow(findings.medium),
      chalk.gray(findings.low)
    ].join('/');

    table.push([
      new Date(entry.timestamp).toLocaleString(),
      entry.scannedCount,
      findingsStr,
      `${entry.durationMs}ms`
    ]);
  }

  logger.log(table.toString());
  logger.detail(`Last 20 scans shown. Full log at ~/.mcp-scan/audit.log`);
}
