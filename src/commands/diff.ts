import fs from 'fs';
import chalk from 'chalk';
import { ScanReport, ServerScanResult, Finding } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';
import { SEVERITY_ORDER } from '../types/severity.js';

/**
 * Runs the diff between two scan reports.
 * @param oldPath Path to the older scan report JSON.
 * @param newPath Path to the newer scan report JSON.
 */
export async function runDiff(oldPath: string, newPath: string) {
  let oldReport: ScanReport;
  let newReport: ScanReport;

  try {
    oldReport = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
  } catch (e: any) {
    logger.error(`Failed to parse old report: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  try {
    newReport = JSON.parse(fs.readFileSync(newPath, 'utf8'));
  } catch (e: any) {
    logger.error(`Failed to parse new report: ${e.message}`);
    process.exitCode = 1;
    return;
  }

    logger.brand(`Diffing scan reports:`);
    logger.detail(`Old: ${oldPath} (${oldReport.totalScanned} servers)`);
    logger.detail(`New: ${newPath} (${newReport.totalScanned} servers)`);
    logger.divider();

    const oldServers = new Map<string, ServerScanResult>(oldReport.results.map(r => [`${r.toolName}:${r.serverName}`, r]));
    const newServers = new Map<string, ServerScanResult>(newReport.results.map(r => [`${r.toolName}:${r.serverName}`, r]));

    const addedServers: string[] = [];
    const removedServers: string[] = [];
    const regressions: { server: string, finding: Finding }[] = [];
    const resolved: { server: string, finding: Finding }[] = [];
    const unchanged: { server: string, findings: Finding[] }[] = [];

    // Find added and changed servers
    for (const [key, newResult] of newServers) {
      const oldResult = oldServers.get(key);
      if (!oldResult) {
        addedServers.push(key);
        for (const f of newResult.findings) {
          regressions.push({ server: key, finding: f });
        }
      } else {
        const oldFindingIds = new Set(oldResult.findings.map(f => `${f.id}:${f.severity}`));
        const newFindingIds = new Set(newResult.findings.map(f => `${f.id}:${f.severity}`));

        // New findings (regressions)
        for (const f of newResult.findings) {
          if (!oldFindingIds.has(`${f.id}:${f.severity}`)) {
            regressions.push({ server: key, finding: f });
          }
        }

        // Resolved findings
        for (const f of oldResult.findings) {
          if (!newFindingIds.has(`${f.id}:${f.severity}`)) {
            resolved.push({ server: key, finding: f });
          }
        }
        
        // Unchanged findings
        const commonFindings = newResult.findings.filter(f => oldFindingIds.has(`${f.id}:${f.severity}`));
        if (commonFindings.length > 0) {
            unchanged.push({ server: key, findings: commonFindings });
        }
      }
    }

    // Find removed servers
    for (const key of oldServers.keys()) {
      if (!newServers.has(key)) {
        removedServers.push(key);
      }
    }

    // Print report
    if (addedServers.length > 0) {
      logger.info(`Servers Added (${addedServers.length}):`);
      addedServers.forEach(s => logger.log(chalk.green(`  + ${s}`)));
      logger.emptyLine();
    }

    if (removedServers.length > 0) {
      logger.info(`Servers Removed (${removedServers.length}):`);
      removedServers.forEach(s => logger.log(chalk.red(`  - ${s}`)));
      logger.emptyLine();
    }

    if (regressions.length > 0) {
      logger.high(`Regressions / New Findings (${regressions.length}):`);
      regressions.sort((a, b) => SEVERITY_ORDER[b.finding.severity] - SEVERITY_ORDER[a.finding.severity])
                 .forEach(r => logger.log(chalk.red(`  [${r.finding.severity}] ${r.server}: ${r.finding.id}`)));
      logger.emptyLine();
    }

    if (resolved.length > 0) {
      logger.pass(`Resolved Findings (${resolved.length}):`);
      resolved.forEach(r => logger.log(chalk.green(`  [FIXED] ${r.server}: ${r.finding.id}`)));
      logger.emptyLine();
    }

    const _hasCriticalOrHighRegressions = regressions.some(r => r.finding.severity === 'CRITICAL' || r.finding.severity === 'HIGH');

    if (regressions.length > 0) {
      logger.high(`Scan Failed: ${regressions.length} new findings detected.`);
      process.exitCode = 1;
    } else if (resolved.length > 0 || addedServers.length > 0 || removedServers.length > 0) {
      logger.pass(`Scan Succeeded: No new findings, some changes detected.`);
    } else {
      logger.pass(`No changes detected between reports.`);
    }
}
