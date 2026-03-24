import os from 'os';
import fs from 'fs';
import path from 'path';
import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers, loadPolicy, loadIgnoreList } from '../config/parser.js';
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
import { scanPackageDeep } from '../scanners/package-scanner.js';
import { scanLicense } from '../scanners/license-scanner.js';
import { ScanReport, ServerScanResult, Finding } from '../types/scan-result.js';
import { DetectedTool, McpScanPolicy } from '../types/config.js';
import { createSpinner } from '../utils/spinner.js';
import { printJsonReport } from '../utils/json-reporter.js';
import { printReport } from '../utils/reporter.js';
import { logScan, checkFingerprints } from '../utils/audit-logger.js';
import { loadCustomRules, evaluateCustomRules } from '../utils/rule-engine.js';
import { runFix } from './fix.js';
import { SEVERITY_ORDER, Severity } from '../types/severity.js';
import { logger } from '../utils/logger.js';

export async function runScan(options: { silent?: boolean, json?: boolean, verbose?: boolean, severity?: string, fix?: boolean, config?: string, version?: string, ugig?: boolean, ci?: boolean, sbom?: string, offline?: boolean } = {}): Promise<ScanReport> {
  const startTime = Date.now();
  
  const policy = loadPolicy();
  const ignoreList = loadIgnoreList();
  const customRules = loadCustomRules();
  if (policy && !options.silent) {
    logger.detail(`Applied security policy from .mcp-scan.json`);
  }

  // Initialize logger based on options
  if (options.silent || options.json || options.ci) logger.isSilent = true;
  if (options.verbose) logger.isVerbose = true;

  const spinner = !logger.isSilent ? createSpinner('Detecting MCP configurations...', !options.ci).start() : null;

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
  
  const minSeverityLevel = (options.severity || policy?.maxSeverity || 'low').toUpperCase() as Severity;
  const minSeverity = SEVERITY_ORDER[minSeverityLevel] || 0;

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

      let allFindings = [
        ...scanSecrets(server),
        ...scanEnvLeak(server, tool.configPath),
        ...scanPromptInjection(server),
        ...scanToolPoisoning(server),
        ...scanPermissions(server),
        ...scanRegistry(server),
        ...scanTyposquat(server),
        ...scanTransport(server, policy?.allowedDomains),
        ...scanConfig(server),
        ...scanAst(server, policy?.allowedDomains),
        ...evaluateCustomRules(server, customRules)
      ];

      // Simple heuristic for package name from supply-chain-scanner
      let packageName = '';
      if (server.command === 'npx' || server.command === 'npm') {
        const pkgArg = (Array.isArray(server.args) ? server.args : (server.args ? Object.values(server.args) : [])).find(a => typeof a === 'string' && !a.startsWith('-'));
        if (pkgArg) packageName = pkgArg as string;
      }

      // Apply policy: Blocked Packages
      if (policy && policy.blockedPackages && (policy.blockedPackages.includes(packageName) || policy.blockedPackages.includes(server.name))) {
        allFindings.push({
          id: 'blocked-package-policy',
          severity: 'CRITICAL',
          description: `Package '${packageName || server.name}' is explicitly blocked by company policy.`,
          fixRecommendation: 'Remove this server or replace it with an approved alternative.'
        });
      }

      // Apply policy: Required Env Var Prefix
      if (policy && policy.requiredEnvVarPrefix && server.env) {
        for (const key of Object.keys(server.env)) {
          if (!key.startsWith(policy.requiredEnvVarPrefix)) {
            allFindings.push({
              id: 'env-var-prefix-risk',
              severity: 'LOW',
              description: `Environment variable '${key}' does not match required prefix '${policy.requiredEnvVarPrefix}'.`,
              fixRecommendation: `Rename the environment variable to use the '${policy.requiredEnvVarPrefix}' prefix.`
            });
          }
        }
      }

      let trustScore: number | undefined;
      let metadata: any;
      if (options.verbose || options.sbom || options.ci) {
        const packageFindings = await scanPackageDeep(server, options.offline);
        allFindings.push(...packageFindings);

        const supplyChainResult = await scanSupplyChain(server, options.offline);
        allFindings.push(...supplyChainResult.findings);
        trustScore = supplyChainResult.trustScore;
        metadata = supplyChainResult.metadata;
        
        const licenseFindings = scanLicense(metadata);
        allFindings.push(...licenseFindings);
      }

      // Apply policy: Suppress Rules
      if (policy && policy.suppressRules) {
        allFindings = allFindings.filter(f => !policy.suppressRules?.includes(f.id));
      }

      // Apply policy: Allowed Packages (skip all severity < critical)
      if (policy && policy.allowedPackages && (policy.allowedPackages.includes(packageName) || policy.allowedPackages.includes(server.name))) {
        allFindings = allFindings.filter(f => f.severity === 'CRITICAL');
      }

      // Apply ignore list
      const processedFindings = allFindings.map(f => {
        const isIgnored = ignoreList.includes(f.id) || 
                          ignoreList.includes(server.name) || 
                          ignoreList.some(i => tool.configPath.endsWith(i));
        
        if (isIgnored) {
          return {
            ...f,
            severity: 'INFO' as Severity,
            description: `[SUPPRESSED] ${f.description}`
          };
        }
        return f;
      });

      const findings = processedFindings.filter(f => SEVERITY_ORDER[f.severity] >= minSeverity);

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

  // 17. Server Fingerprinting (Mutation Check)
  const mutations = checkFingerprints(report.results);
  for (const result of report.results) {
    const serverKey = `${result.toolName}:${result.serverName}`;
    if (mutations[serverKey]) {
      result.findings.push(...mutations[serverKey]);
      for (const f of mutations[serverKey]) {
        if (f.severity === 'LOW') report.lowCount++;
        else if (f.severity === 'MEDIUM') report.mediumCount++;
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
  
  logScan(report);
  
  if (options.fix) {
    await runFix();
  }

  return report;
}
