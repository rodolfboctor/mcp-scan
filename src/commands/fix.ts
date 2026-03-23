import { runScan } from './scan.js';
import { logger } from '../utils/logger.js';
import { atomicWriteConfig } from '../config/writer.js';
import { parseConfig } from '../config/parser.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

export async function runFix() {
  logger.brand('Starting interactive auto-fix...');
  const report = await runScan({ silent: true });

  let fixedCount = 0;

  for (const result of report.results) {
    const fixableFindings = result.findings.filter(f => f.fixable);
    
    if (fixableFindings.length === 0) continue;

    for (const finding of fixableFindings) {
      logger.divider();
      logger.warn(`Issue in ${result.serverName} (${result.configPath})`);
      logger.log(`[${finding.severity}] ${finding.description}`);
      logger.fix(`Proposed Fix: ${finding.fixRecommendation}`);
      
      const answer = await question('Apply this fix? (y/N): ');
      if (answer.toLowerCase().startsWith('y')) {
        try {
           const config = parseConfig(result.configPath);
           if (config && config.mcpServers[result.serverName]) {
             
             // Simplistic auto-fix for exposed secrets
             if (finding.id === 'exposed-secret' && config.mcpServers[result.serverName].env) {
                // Find which env var looks like a secret and strip it, replacing with a generic ref
                const env = config.mcpServers[result.serverName].env as Record<string, string>;
                for (const key of Object.keys(env)) {
                   if (env[key].length > 20) { // Naive check for the fix
                       env[key] = `\${${key}}`;
                   }
                }
                
                atomicWriteConfig(result.configPath, JSON.stringify(config, null, 2));
                logger.pass('Fix applied successfully.');
                fixedCount++;
             } else {
                logger.error('Auto-fix logic not implemented for this specific issue type yet.');
             }
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
  logger.brand(`Auto-fix complete. Applied ${fixedCount} fixes.`);
}
