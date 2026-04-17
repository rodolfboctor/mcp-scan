import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';

/**
 * Runs a system diagnostic check.
 */
export async function runDoctor() {
  logger.brand('mcp-scan DOCTOR: System Diagnostic');
  logger.divider();

  let allPassed = true;

  const check = (name: string, status: boolean, detail?: string) => {
    if (status) {
      logger.log(`${chalk.green('✓')} ${chalk.bold(name)}`);
    } else {
      logger.log(`${chalk.red('✗')} ${chalk.bold(name)}`);
      if (detail) logger.detail(`  ${chalk.red('↳')} ${detail}`);
      allPassed = false;
    }
  };

  // 1. Tool Configuration Check
  const tools = await detectTools({ fs, os, process });
  const existingTools = tools.filter(t => t.exists);
  check('Configuration detection', existingTools.length > 0, `${tools.length} possible locations checked, ${existingTools.length} found.`);

  // 2. Parser & Executable Check
  let configIssues = 0;
  let missingExecutables = 0;
  
  for (const tool of existingTools) {
    const config = parseConfig(tool.configPath);
    if (!config) {
      configIssues++;
      continue;
    }
    const servers = extractServers(tool.name, tool.configPath, config);
    for (const server of servers) {
      if (server.command && !['node', 'npx', 'npm', 'python', 'python3', 'docker'].includes(server.command)) {
        // Simple heuristic for local paths
        if (server.command.startsWith('.') || server.command.includes('/') || server.command.includes('\\')) {
            if (!fs.existsSync(server.command)) {
                missingExecutables++;
            }
        } else {
            // Check if in PATH
            try {
                execSync(`which ${server.command}`, { stdio: 'ignore' });
            } catch (_e) {
                missingExecutables++;
            }
        }
      }
    }
  }
  check('Configuration parsing', configIssues === 0, `${configIssues} config files failed to parse.`);
  check('Server executables', missingExecutables === 0, `${missingExecutables} servers reference executables not found in system PATH.`);

  // 3. Environment Variables
  const envVars = ['GITHUB_TOKEN', 'UGIG_API_KEY', 'MCP_SCAN_SLACK_WEBHOOK', 'MCP_SCAN_WEBHOOK_URL'];
  const setVars = envVars.filter(v => process.env[v]);
  const requiredVars = ['GITHUB_TOKEN'];
  const requiredSet = requiredVars.filter(v => process.env[v]);
  check('Required env vars', requiredSet.length === requiredVars.length, `GITHUB_TOKEN missing, supply chain scanning will be limited.`);
  check('Optional env vars', true, `${setVars.length}/${envVars.length} optional variables configured.`);

  // 4. External API Access (GitHub)
  let githubOk = false;
  let githubDetail = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch('https://api.github.com/zen', {
        headers: { 'User-Agent': 'mcp-scan-doctor' },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (res.ok) {
        githubOk = true;
        const rateLimit = res.headers.get('x-ratelimit-remaining');
        githubDetail = `GitHub API responsive. Rate limit remaining: ${rateLimit}`;
    } else {
        githubDetail = `GitHub API returned ${res.status}: ${res.statusText}`;
    }
  } catch (_e: any) {
    githubDetail = `GitHub API unreachable: ${_e.message}`;
  }
  check('External API (GitHub)', githubOk, githubDetail);

  // 5. Tool Update Check
  let updateOk = false;
  let updateDetail = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch('https://registry.npmjs.org/mcp-scan/latest', { signal: controller.signal });
      if (res.ok) {
          const data = await res.json() as { version: string };
          const latest = data.version;
          updateOk = true;
          updateDetail = `Latest version available on npm: ${latest}`;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (_e) {}
  check('Update check (npm)', updateOk, updateDetail);

  logger.divider();
  if (allPassed) {
    logger.pass('System is healthy! mcp-scan is ready to use.');
  } else {
    logger.error('Some diagnostic checks failed. Please review the findings above.');
    process.exitCode = 1;
  }
}
