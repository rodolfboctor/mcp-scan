import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { scanSecrets } from '../scanners/secret-scanner.js';
import { scanPermissions } from '../scanners/permission-scanner.js';
import { scanRegistry } from '../scanners/registry-scanner.js';
import { scanTyposquat } from '../scanners/typosquat-scanner.js';
import { scanTransport } from '../scanners/transport-scanner.js';
import { scanConfig } from '../scanners/config-scanner.js';
import { ScanReport, ServerScanResult } from '../types/scan-result.js';
import { printReport } from '../utils/reporter.js';
import { createSpinner } from '../utils/spinner.js';

export async function runScan(options: { silent?: boolean, json?: boolean, verbose?: boolean } = {}): Promise<ScanReport> {
  const startTime = Date.now();
  const spinner = !options.silent ? createSpinner('Detecting MCP configurations...').start() : null;

  if (options.verbose && spinner) {
    spinner.stop();
    logger.info('Verbose mode enabled. Printing detailed logs.');
  }

  const tools = detectTools();
  if (options.verbose) logger.detail(`Detected ${tools.length} potential tool configs.`);
  const report: ScanReport = {
    results: [],
    totalScanned: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalDurationMs: 0
  };

  const seenServers = new Set<string>();

  for (const tool of tools) {
    if (!tool.exists) continue;

    const config = parseConfig(tool.configPath);
    if (!config) continue;

    const servers = extractServers(tool.name, tool.configPath, config);
    const activeServers = servers.filter(s => !s.disabled);
    
    for (const server of activeServers) {
      const serverStartTime = Date.now();
      
      const serverKey = `${server.command} ${server.args?.join(' ') || ''}`;
      if (seenServers.has(serverKey)) {
        // Just note duplicate, not a full re-scan
        report.results.push({
          serverName: server.name,
          toolName: tool.name,
          configPath: tool.configPath,
          scanDurationMs: 0,
          findings: [{
            id: 'duplicate-server',
            severity: 'MEDIUM',
            description: `Duplicate server definition found across tools.`,
          }]
        });
        report.mediumCount++;
        continue;
      }
      seenServers.add(serverKey);

      if (spinner) spinner.text = `Scanning ${server.name} in ${tool.name}...`;

      const findings = [
        ...scanSecrets(server),
        ...scanPermissions(server),
        ...scanRegistry(server),
        ...scanTyposquat(server),
        ...scanTransport(server),
        ...scanConfig(server)
      ];

      const serverResult: ServerScanResult = {
        serverName: server.name,
        toolName: tool.name,
        configPath: tool.configPath,
        findings,
        scanDurationMs: Date.now() - serverStartTime
      };

      report.results.push(serverResult);
      report.totalScanned++;

      for (const finding of findings) {
        if (finding.severity === 'CRITICAL') report.criticalCount++;
        else if (finding.severity === 'HIGH') report.highCount++;
        else if (finding.severity === 'MEDIUM') report.mediumCount++;
        else if (finding.severity === 'LOW') report.lowCount++;
        else if (finding.severity === 'INFO') report.infoCount++;
      }
    }
  }

  report.totalDurationMs = Date.now() - startTime;
  
  if (spinner) {
    spinner.succeed(`Scan complete in ${report.totalDurationMs}ms`);
  }

  if (!options.json) {
    printReport(report);
  }

  return report;
}
