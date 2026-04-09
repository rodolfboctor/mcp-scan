import fs from 'fs';
import path from 'path';
import os from 'os';
import { CustomRule } from '../types/rules.js';
import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { logger } from './logger.js';

const RULES_DIR = path.join(os.homedir(), '.mcp-scan', 'rules');

/**
 * Loads custom rules from the rules directory.
 */
export function loadCustomRules(): CustomRule[] {
  const rules: CustomRule[] = [];
  try {
    if (!fs.existsSync(RULES_DIR)) return rules;

    const files = fs.readdirSync(RULES_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const fullPath = path.join(RULES_DIR, file);
          const content = fs.readFileSync(fullPath, 'utf8');
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              rules.push(...parsed);
            } else {
              rules.push(parsed);
            }
          } catch (e: any) {
            logger.warn(`Failed to parse rule file ${fullPath}: ${e.message}`);
          }
        } catch (e: any) {
          logger.warn(`Failed to parse custom rule file ${file}: ${e.message}`);
        }
      }
    }
  } catch (_error) {}
  return rules;
}

/**
 * Evaluates custom rules against a server configuration.
 */
export function evaluateCustomRules(server: ResolvedServer, rules: CustomRule[]): Finding[] {
  const findings: Finding[] = [];

  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.pattern, 'i');
      
      let matchFound = false;
      let matchSource = '';

      if (rule.target === 'command' && server.command && regex.test(server.command)) {
        matchFound = true;
        matchSource = `command '${server.command}'`;
      } else if (rule.target === 'args' && server.args) {
        const argsArray = Array.isArray(server.args) ? server.args : Object.values(server.args);
        const matchingArg = argsArray.find(a => typeof a === 'string' && regex.test(a));
        if (matchingArg) {
          matchFound = true;
          matchSource = `argument '${matchingArg}'`;
        }
      } else if (rule.target === 'env' && server.env) {
        const matchingKey = Object.keys(server.env).find(k => regex.test(k) || regex.test(server.env![k]));
        if (matchingKey) {
           matchFound = true;
           matchSource = `environment variable '${matchingKey}'`;
        }
      } else if (rule.target === 'url') {
        const url = server.url || '';
        if (url && regex.test(url)) {
          matchFound = true;
          matchSource = `url '${url}'`;
        }
      } else if (rule.target === 'name' && regex.test(server.name)) {
        matchFound = true;
        matchSource = `server name '${server.name}'`;
      }

      const triggered = rule.negate ? !matchFound : matchFound;
      if (triggered) {
        const source = rule.negate ? `(no match for '${rule.pattern}' in ${rule.target})` : matchSource;
        findings.push({
          id: rule.id,
          severity: rule.severity,
          description: `Custom rule '${rule.id}' triggered ${source}: ${rule.description}`,
          fixRecommendation: rule.fixRecommendation
        });
      }
    } catch (_e: any) {
      // Invalid regex, skip rule
    }
  }

  return findings;
}
