import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { scanDataControls } from '../scanners/data-controls-scanner.js';
import { scanNetworkEgress } from '../scanners/network-egress-scanner.js';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';

export async function runPrivacy(options: { format?: string, retention?: boolean }) {
  const tools = await detectTools({ fs, os, process });
  const report: any = {
      assessment: 'Privacy Impact Assessment',
      servers: []
  };

  for (const tool of tools) {
      if (!tool.exists) continue;
      const config = parseConfig(tool.configPath);
      if (!config) continue;
      const servers = extractServers(tool.name, tool.configPath, config).filter(s => !s.disabled);
      
      for (const server of servers) {
          const findings = scanDataControls(server, options.retention);
          const pii = findings.find(f => f.id === 'data-controls-pii')?.description || 'None detected';
          const retention = findings.find(f => f.id === 'data-controls-retention-gap') ? 'No policy detected (RISK)' : 'Policy detected';
          const encryption = findings.find(f => f.id === 'data-controls-encryption-gap') ? 'Not detected (RISK)' : 'Detected';
          const sharingFindings = scanNetworkEgress(server);
          const sharing = sharingFindings.length > 0 ? `${sharingFindings.length} endpoints detected` : 'None detected';
          const promptLogging = findings.find(f => f.id === 'data-controls-prompt-logging') ? 'Detected in server logs' : 'Not detected';
          
          const gaps = findings.filter(f => f.id.endsWith('-gap')).length;
          
          report.servers.push({
              name: server.name,
              tool: tool.name,
              pii,
              retention,
              encryption,
              sharing,
              promptLogging,
              gaps
          });
      }
  }

  if (options.format === 'json') {
      console.log(JSON.stringify(report, null, 2));
      return;
  }

  console.log(chalk.hex('#339DFF')('-- Data Controls Assessment ----------------------\n'));
  if (report.servers.length === 0) {
      console.log('No active servers found.\n');
      return;
  }

  for (const s of report.servers) {
      console.log(`Server: ${chalk.bold(s.name)}`);
      console.log(`PII detected: ${s.pii.replace('Server handles PII: ', '')}`);
      console.log(`Data retention: ${s.retention.includes('RISK') ? chalk.red(s.retention) : chalk.green(s.retention)}`);
      console.log(`Encryption at rest: ${s.encryption.includes('RISK') ? chalk.red(s.encryption) : chalk.green(s.encryption)}`);
      console.log(`Third-party sharing: ${s.sharing}`);
      console.log(`Prompt logging: ${s.promptLogging.includes('Detected') ? chalk.yellow(s.promptLogging) : chalk.green(s.promptLogging)}`);
      console.log(`GDPR compliance gaps: ${s.gaps}`);
      console.log();
      
      if (s.gaps > 0 || s.retention.includes('RISK')) {
          console.log(chalk.dim(`Recommendation: Implement data retention policy. Add user data deletion endpoint.`));
          console.log(chalk.dim(`See: https://thynkq.com/docs/mcp-data-controls\n`));
      }
  }
}