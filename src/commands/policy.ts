import { validatePolicy, loadYamlPolicy } from '../policy/engine.js';
import chalk from 'chalk';
import fs from 'fs';

export async function runPolicyAction(action: string, file: string = '.mcp-scan-policy.yml') {
    if (action === 'validate') {
        const isValid = validatePolicy(file);
        if (!isValid) {
            process.exitCode = 1;
        }
    } else if (action === 'init') {
        if (fs.existsSync(file)) {
            console.error(chalk.red(`Error: Policy file already exists at ${file}`));
            process.exitCode = 1;
            return;
        }
        const defaultPolicy = {
            version: 1,
            rules: [
                {
                    id: 'allow-localhost',
                    description: 'Allow connections to localhost for development',
                    action: 'skip',
                    match: {
                        finding_id: 'network-egress-unknown',
                        category: ['localhost', '127.0.0.1']
                    }
                },
                {
                    id: 'block-all-secrets',
                    description: 'Escalate all exposed secrets to critical',
                    action: 'override-severity',
                    severity: 'critical',
                    match: {
                        finding_id: 'exposed-secret'
                    }
                }
            ]
        };
        fs.writeFileSync(file, JSON.stringify(defaultPolicy, null, 2).replace(/"/g, "'").replace(/\{/g, '{ ').replace(/\}/g, ' }'));
        // Wait, I should probably use YAML format if I named it .yml
        const yamlContent = `version: 1
rules:
  - id: allow-localhost
    description: "Allow connections to localhost for development"
    action: skip
    match:
      finding_id: "network-egress-unknown"
      category: ["localhost", "127.0.0.1"]
  - id: block-all-secrets
    description: "Escalate all exposed secrets to critical"
    action: override-severity
    severity: critical
    match:
      finding_id: "exposed-secret"
`;
        fs.writeFileSync(file, yamlContent);
        console.log(chalk.green(`Successfully initialized default policy at ${file}`));
    } else if (action === 'show') {
        const policy = loadYamlPolicy(file);
        if (!policy) {
            console.error(chalk.red(`Error: Could not load policy from ${file}`));
            process.exitCode = 1;
            return;
        }
        console.log(chalk.bold(`\n-- Active Policy: ${file} --`));
        console.log(`Version: ${policy.version}`);
        console.log(`Rules: ${policy.rules.length}\n`);
        
        for (const rule of policy.rules) {
            console.log(`${chalk.hex('#339DFF')(rule.id)} [${rule.action.toUpperCase()}]`);
            if (rule.description) console.log(chalk.dim(`  ${rule.description}`));
            if (rule.match) console.log(chalk.dim(`  Match: ${JSON.stringify(rule.match)}`));
            console.log();
        }
    } else {
        console.log(chalk.yellow(`Unknown policy action: ${action}. Use 'validate', 'init', or 'show'.`));
        process.exitCode = 1;
    }
}
