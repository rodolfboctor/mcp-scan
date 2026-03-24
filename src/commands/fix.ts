import { runScan } from './scan.js';
import { logger } from '../utils/logger.js';
import { atomicWriteConfig } from '../config/writer.js';
import { parseConfig } from '../config/parser.js';
import readline from 'readline';
import { SECRET_PATTERNS } from '../data/secret-patterns.js';
import chalk from 'chalk';

export async function runFix() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

  logger.brand('Starting interactive auto-fix with confidence scoring...');
  const initialReport = await runScan({ silent: true });

  let fixedCount = 0;
  let autoAppliedCount = 0;

  for (const result of initialReport.results) {
    const fixableFindings = result.findings.filter(f => f.fixable);
    
    if (fixableFindings.length === 0) continue;

    for (const finding of fixableFindings) {
      const confidence = finding.remediationConfidence || 50;
      const confidenceColor = confidence >= 90 ? chalk.green : confidence >= 70 ? chalk.yellow : chalk.red;
      
      logger.divider();
      logger.warn(`Issue in ${result.serverName} (${result.configPath})`);
      logger.log(`[${finding.severity}] ${finding.description}`);
      logger.log(`Confidence Score: ${confidenceColor(confidence + '%')}`);
      logger.fix(`Proposed Fix: ${finding.fixRecommendation}`);
      
      let shouldApply = false;
      if (confidence >= 95) {
        const answer = await question('High confidence fix. Auto-apply? (Y/n): ');
        shouldApply = !answer.toLowerCase().startsWith('n');
        if (shouldApply) autoAppliedCount++;
      } else {
        const answer = await question('Apply this fix? (y/N): ');
        shouldApply = answer.toLowerCase().startsWith('y');
      }

      if (shouldApply) {
        try {
           const config = parseConfig(result.configPath);
           if (!config || !config.mcpServers[result.serverName]) continue;

           const server = config.mcpServers[result.serverName];
           let changed = false;

           // 1. Fix exposed secrets
           if (finding.id === 'exposed-secret' && server.env) {
              for (const [key, value] of Object.entries(server.env)) {
                 for (const pattern of SECRET_PATTERNS) {
                    if (pattern.regex.test(value)) {
                       server.env[key] = `\${${key}}`;
                       changed = true;
                       break;
                    }
                 }
              }
           } 
           // 2. Fix HTTP to HTTPS
           else if (finding.id === 'http-transport-no-auth' && server.args) {
              server.args = server.args.map(arg => {
                 if (arg.startsWith('http://')) {
                    changed = true;
                    return arg.replace('http://', 'https://');
                 }
                 return arg;
              });
           }
           // 3. Fix outdated transport
           else if (finding.id === 'outdated-transport' && server.args) {
              server.args = server.args.map(arg => {
                 if (arg === '--transport=sse') {
                    changed = true;
                    return '--transport=streamable-http';
                 }
                 return arg;
              });
           }

           if (changed) {
              atomicWriteConfig(result.configPath, JSON.stringify(config, null, 2));
              logger.pass('Fix applied successfully.');
              fixedCount++;
           } else {
              logger.error('Could not apply fix automatically.');
           }
        } catch (e: any) {
           logger.error(`Failed to apply fix: ${e.message}`);
        }
      } else {
        logger.info('Skipped.');
      }
    }
  }

  rl.close();
  logger.divider();
  
  if (fixedCount > 0) {
    logger.brand(`Auto-fix complete. Applied ${fixedCount} fixes (${autoAppliedCount} auto-applied).`);
    logger.info('Re-scanning to verify fixes...');
    const finalReport = await runScan({ silent: true });
    const remaining = finalReport.criticalCount + finalReport.highCount + finalReport.mediumCount + finalReport.lowCount;
    const resolved = (initialReport.criticalCount + initialReport.highCount + initialReport.mediumCount + initialReport.lowCount) - remaining;
    logger.pass(`Verification complete: ${resolved} issues resolved, ${remaining} issues remaining.`);
  } else {
    logger.brand('Auto-fix complete. No changes made.');
  }
}
