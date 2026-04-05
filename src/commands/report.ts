import { runScan } from './scan.js';
import { logger } from '../utils/logger.js';
import { ScanReport } from '../types/scan-result.js';
import glob from 'fast-glob';
import path from 'path';
import fs from 'fs';
import { printJsonReport } from '../utils/json-reporter.js';
import { printReport } from '../utils/reporter.js';
import { generateHtmlReport } from '../utils/html-reporter.js';

/**
 * Scans all config files in a directory and aggregates them into one report.
 */
export async function runMultiConfigReport(options: { configs?: string, html?: string, json?: boolean }) {
  const targetDir = options.configs || process.cwd();
  logger.brand(`Aggregating reports from: ${targetDir}`);

  const configFiles = await glob(['**/*.json', '**/*.toml', '**/*.yaml', '**/*.yml'], {
    cwd: targetDir,
    absolute: true,
    ignore: [
      '**/node_modules/**',
      '**/package.json',
      '**/package-lock.json',
      '**/tsconfig.json',
      '**/.mcp-scan.json',
      '**/.mcp-scan-policy.yml',
      '**/.github/**',
      '**/dist/**',
    ]
  });

  if (configFiles.length === 0) {
    logger.error(`No config files found in ${targetDir}`);
    return;
  }

  logger.info(`Found ${configFiles.length} potential config files.`);

  const aggregatedReport: ScanReport = {
    results: [],
    totalScanned: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalDurationMs: 0
  };

  const startTime = Date.now();
  const seenServers = new Set<string>();

  for (const file of configFiles) {
    // Basic check if it looks like an MCP config
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('mcpServers') && !content.includes('mcp_servers')) continue;
        
        logger.detail(`Scanning: ${path.relative(targetDir, file)}`);
        const report = await runScan({ silent: true, config: file });
        
        for (const result of report.results) {
            const key = `${result.serverName}:${JSON.stringify(result.findings)}`;
            if (!seenServers.has(key)) {
                seenServers.add(key);
                aggregatedReport.results.push(result);
                aggregatedReport.criticalCount += result.findings.filter(f => f.severity === 'CRITICAL').length;
                aggregatedReport.highCount += result.findings.filter(f => f.severity === 'HIGH').length;
                aggregatedReport.mediumCount += result.findings.filter(f => f.severity === 'MEDIUM').length;
                aggregatedReport.lowCount += result.findings.filter(f => f.severity === 'LOW').length;
                aggregatedReport.infoCount += result.findings.filter(f => f.severity === 'INFO').length;
                aggregatedReport.totalScanned++;
            }
        }
    } catch (_e) {}
  }

  aggregatedReport.totalDurationMs = Date.now() - startTime;

  if (options.json) {
    printJsonReport(aggregatedReport);
  } else {
    printReport(aggregatedReport);
  }

  if (options.html) {
    const htmlContent = generateHtmlReport(aggregatedReport);
    fs.writeFileSync(options.html, htmlContent);
    logger.pass(`Aggregated HTML report generated: ${options.html}`);
  }
}
