import { validatePolicy } from '../policy/engine.js';
import chalk from 'chalk';

export async function runPolicyAction(action: string, file: string = '.mcp-scan-policy.yml') {
    if (action === 'validate') {
        const isValid = validatePolicy(file);
        if (!isValid) {
            process.exitCode = 1;
        }
    } else {
        console.log(chalk.yellow(`Unknown policy action: ${action}. Use 'validate'.`));
        process.exitCode = 1;
    }
}