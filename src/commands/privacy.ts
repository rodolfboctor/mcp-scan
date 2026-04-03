import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { scanDataControls } from '../scanners/data-controls-scanner.js';
import { scanNetworkEgress } from '../scanners/network-egress-scanner.js';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';

export async function runPrivacy(options: { format?: string, output?: string, retention?: boolean }) {
  const tools = await detectTools({ fs, os, process });
  const report: any = {
      assessment: 'Privacy Impact Assessment',
      generatedAt: new Date().toISOString(),
      summary: {
          totalServers: 0,
          piiServers: 0,
          totalGaps: 0,
          riskScore: 0
      },
      servers: []
  };

  for (const tool of tools) {
      if (!tool.exists) continue;
      const config = parseConfig(tool.configPath);
      if (!config) continue;
      const servers = extractServers(tool.name, tool.configPath, config).filter(s => !s.disabled);
      
      for (const server of servers) {
          const findings = scanDataControls(server, options.retention);
          const piiFinding = findings.find(f => f.id === 'data-controls-pii');
          const pii = piiFinding?.description.replace('Server handles PII/Sensitive data: ', '') || 'None detected';
          const retention = findings.find(f => f.id === 'data-controls-retention-gap') ? 'No policy detected (RISK)' : 'Policy detected';
          const encryption = findings.find(f => f.id === 'data-controls-encryption-gap') ? 'Not detected (RISK)' : 'Detected';
          const sharingFindings = scanNetworkEgress(server);
          const sharing = sharingFindings.length > 0 ? `${sharingFindings.length} external endpoints` : 'None detected';
          const promptLogging = findings.find(f => f.id === 'data-controls-prompt-logging') ? 'Detected' : 'Not detected';
          
          const gaps = findings.filter(f => f.id.endsWith('-gap')).length;
          
          report.summary.totalServers++;
          if (piiFinding) report.summary.piiServers++;
          report.summary.totalGaps += gaps;
          
          report.servers.push({
              name: server.name,
              tool: tool.name,
              pii,
              retention,
              encryption,
              sharing,
              promptLogging,
              gaps,
              risk: piiFinding ? (gaps > 2 ? 'HIGH' : 'MEDIUM') : (gaps > 0 ? 'LOW' : 'INFO')
          });
      }
  }

  // Calculate global risk score (0-100)
  if (report.summary.totalServers > 0) {
      const piiPenalty = (report.summary.piiServers / report.summary.totalServers) * 40;
      const gapPenalty = Math.min((report.summary.totalGaps / (report.summary.totalServers * 4)) * 60, 60);
      report.summary.riskScore = Math.round(piiPenalty + gapPenalty);
  }

  // Handle Output Formats
  if (options.format === 'json') {
      console.log(JSON.stringify(report, null, 2));
      if (options.output) fs.writeFileSync(options.output, JSON.stringify(report, null, 2));
      return;
  }

  if (options.format === 'csv') {
      let csv = 'Server,Tool,PII,Retention,Encryption,Sharing,PromptLogging,Gaps,Risk\n';
      for (const s of report.servers) {
          csv += `"${s.name}","${s.tool}","${s.pii}","${s.retention}","${s.encryption}","${s.sharing}","${s.promptLogging}",${s.gaps},"${s.risk}"\n`;
      }
      if (options.output) {
          fs.writeFileSync(options.output, csv);
          console.log(`Saved CSV report to ${options.output}`);
      } else {
          console.log(csv);
      }
      return;
  }

  // Default Console / Markdown Output
  const renderConsole = () => {
      console.log(chalk.hex('#339DFF').bold('\n-- Privacy Impact Assessment ----------------------'));
      console.log(chalk.dim(`Generated: ${new Date().toLocaleString()}\n`));

      console.log(`Global Risk Score: ${report.summary.riskScore > 70 ? chalk.red.bold(report.summary.riskScore) : report.summary.riskScore > 30 ? chalk.yellow(report.summary.riskScore) : chalk.green(report.summary.riskScore)} / 100`);
      console.log(`Summary: ${report.summary.piiServers} / ${report.summary.totalServers} servers handle sensitive data.`);
      console.log(`Compliance: ${report.summary.totalGaps} total security gaps detected.\n`);

      for (const s of report.servers) {
          const riskColor = s.risk === 'HIGH' ? chalk.red : s.risk === 'MEDIUM' ? chalk.yellow : chalk.green;
          console.log(`${riskColor('●')} Server: ${chalk.bold(s.name)} [${s.risk} RISK]`);
          console.log(`  PII: ${s.pii}`);
          console.log(`  Retention: ${s.retention.includes('RISK') ? chalk.red(s.retention) : chalk.green(s.retention)}`);
          console.log(`  Encryption: ${s.encryption.includes('RISK') ? chalk.red(s.encryption) : chalk.green(s.encryption)}`);
          console.log(`  Sharing: ${s.sharing}`);
          console.log(`  Prompt Logging: ${s.promptLogging === 'Detected' ? chalk.yellow(s.promptLogging) : chalk.green(s.promptLogging)}`);
          console.log();
      }

      if (report.summary.totalGaps > 0) {
          console.log(chalk.hex('#FFB833').bold('Recommendations:'));
          console.log(chalk.dim('1. Implement Data Retention Policies (TTL) for all PII data.'));
          console.log(chalk.dim('2. Enable Encryption at Rest for local storage.'));
          console.log(chalk.dim('3. Add user data deletion capabilities to PII-handling servers.\n'));
      }
  };

  renderConsole();

  if (options.output && options.format !== 'json' && options.format !== 'csv') {
      let md = `# Privacy Impact Assessment\n\n`;
      md += `**Global Risk Score:** ${report.summary.riskScore} / 100\n`;
      md += `**Summary:** ${report.summary.piiServers} / ${report.summary.totalServers} servers handle sensitive data.\n\n`;
      md += `| Server | Risk | PII | Gaps |\n| --- | --- | --- | --- |\n`;
      for (const s of report.servers) {
          md += `| ${s.name} | ${s.risk} | ${s.pii} | ${s.gaps} |\n`;
      }
      fs.writeFileSync(options.output, md);
      console.log(`Saved Markdown report to ${options.output}`);
  }
}
