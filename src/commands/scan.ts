import os from 'os';
import fs from 'fs';
import path from 'path';
import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { scanSecrets } from '../scanners/secret-scanner.js';
import { scanPermissions } from '../scanners/permission-scanner.js';
import { scanRegistry } from '../scanners/registry-scanner.js';
import { scanTyposquat } from '../scanners/typosquat-scanner.js';
import { scanTransport } from '../scanners/transport-scanner.js';
import { scanConfig } from '../scanners/config-scanner.js';
import { scanAst } from '../scanners/ast-scanner.js';
import { scanPromptInjection } from '../scanners/prompt-injection-scanner.js';
import { scanToolPoisoning } from '../scanners/tool-poisoning-scanner.js';
import { scanEnvLeak } from '../scanners/env-leak-scanner.js';
import { scanSupplyChain } from '../scanners/supply-chain-scanner.js';
import { scanLicense } from '../scanners/license-scanner.js';
import { ScanReport, ServerScanResult } from '../types/scan-result.js';
import { DetectedTool } from '../types/config.js';
import { createSpinner } from '../utils/spinner.js';
import { printJsonReport } from '../utils/json-reporter.js';
import { printReport } from '../utils/reporter.js';
import { runFix } from './fix.js';
import { SEVERITY_ORDER, Severity } from '../types/severity.js';
import { logger } from '../utils/logger.js';

export async function runScan(options: { silent?: boolean, json?: boolean, verbose?: boolean, severity?: string, fix?: boolean, config?: string, version?: string, ugig?: boolean, ci?: boolean, sbom?: string } = {}): Promise<ScanReport> {
  const startTime = Date.now();
  
  // Initialize logger based on options
  if (options.silent) logger.isSilent = true;
  if (options.verbose) logger.isVerbose = true;

  const spinner = !options.silent ? createSpinner('Detecting MCP configurations...', !options.ci).start() : null;

  if (options.verbose && spinner) {
    spinner.stop();
    logger.info('Verbose mode enabled. Printing detailed logs.');
  }

  let tools: DetectedTool[];

  if (options.config) {
    const configPath = path.resolve(options.config);
    const exists = fs.existsSync(configPath);
    const toolName = path.basename(configPath, path.extname(configPath));
    tools = [{ name: toolName, configPath, exists }];
    if (options.verbose) logger.detail(`Using config file: ${configPath}`);
  } else {
    tools = await detectTools({ fs, os, process });
  }
  if (options.verbose) logger.detail(`Detected ${tools.length} potential tool configs.`);
  const report: ScanReport = {
    results: [],
    totalScanned: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalDurationMs: 0,
    version: options.version
  };

  const seenServers = new Set<string>();
  const minSeverity = options.severity ? SEVERITY_ORDER[options.severity.toUpperCase() as Severity] : 0;

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

      const allFindings = [
        ...scanSecrets(server),
        ...scanEnvLeak(server, tool.configPath),
        ...scanPromptInjection(server),
        ...scanToolPoisoning(server),
        ...scanPermissions(server),
        ...scanRegistry(server),
        ...scanTyposquat(server),
        ...scanTransport(server),
        ...scanConfig(server),
        ...scanAst(server)
      ];

      let trustScore: number | undefined;
      let metadata: any;
      if (options.verbose || options.sbom) {
        const supplyChainResult = await scanSupplyChain(server);
        allFindings.push(...supplyChainResult.findings);
        trustScore = supplyChainResult.trustScore;
        metadata = supplyChainResult.metadata;
        
        const licenseFindings = scanLicense(metadata);
        allFindings.push(...licenseFindings);
      }

      const findings = allFindings.filter(f => SEVERITY_ORDER[f.severity] >= minSeverity);

      const serverResult: ServerScanResult = {
        serverName: server.name,
        toolName: tool.name,
        configPath: tool.configPath,
        findings,
        scanDurationMs: Date.now() - serverStartTime,
        trustScore,
        metadata
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

  if (!options.silent) {
    if (options.json) {
      printJsonReport(report);
    } else {
      printReport(report, { ugig: options.ugig });
    }
  }
  
  if (options.fix) {
    await runFix();
  }

  return report;
}
