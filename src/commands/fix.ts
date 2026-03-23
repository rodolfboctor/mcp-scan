import { runScan } from './scan.js';
import { logger } from '../utils/logger.js';
import { atomicWriteConfig } from '../config/writer.js';
import { parseConfig } from '../config/parser.js';
import readline from 'readline';
import { SECRET_PATTERNS } from '../data/secret-patterns.js';

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
  logger.brand(`Auto-fix complete. Applied ${fixedCount} fixes.`);
}
