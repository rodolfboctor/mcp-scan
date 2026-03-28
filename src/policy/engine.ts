import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'yaml';
import { Finding, ServerScanResult } from '../types/scan-result.js';
import chalk from 'chalk';

export interface PolicyRule {
  id: string;
  scanner: string;
  action: 'block' | 'warn' | 'skip' | 'override-severity';
  severity?: string;
  match: Record<string, any>;
}

export interface SecurityPolicy {
  version: number;
  rules: PolicyRule[];
}

export function loadYamlPolicy(customPath?: string): SecurityPolicy | null {
  let policyPath = customPath;
  
  if (!policyPath) {
    const cwdPath = path.join(process.cwd(), '.mcp-scan-policy.yml');
    const homePath = path.join(os.homedir(), '.mcp-scan-policy.yml');
    
    if (fs.existsSync(cwdPath)) policyPath = cwdPath;
    else if (fs.existsSync(homePath)) policyPath = homePath;
  }
  
  if (!policyPath || !fs.existsSync(policyPath)) return null;
  
  try {
    const content = fs.readFileSync(policyPath, 'utf8');
    const parsed = parse(content);
    return parsed as SecurityPolicy;
  } catch (e: any) {
    console.warn(chalk.yellow(`Warning: Failed to parse policy file at ${policyPath}: ${e.message}`));
    return null;
  }
}

export function validatePolicy(policyPath: string): boolean {
  if (!fs.existsSync(policyPath)) {
      console.error(chalk.red(`Policy file not found: ${policyPath}`));
      return false;
  }
  try {
    const content = fs.readFileSync(policyPath, 'utf8');
    const parsed = parse(content);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.rules)) {
      console.error(chalk.red('Invalid policy schema. Expected version: 1 and rules array.'));
      return false;
    }
    for (const rule of parsed.rules) {
      if (!rule.id || !rule.action) {
        console.error(chalk.red(`Rule missing required fields (id, action): ${JSON.stringify(rule)}`));
        return false;
      }
      if (rule.scanner && typeof rule.scanner !== 'string') {
        console.warn(chalk.yellow(`Rule ${rule.id} has an invalid scanner type.`));
      }
    }
    console.log(chalk.green(`Policy file ${policyPath} is valid.`));
    return true;
  } catch (e: any) {
    console.error(chalk.red(`Policy validation failed: ${e.message}`));
    return false;
  }
}

export function applyPolicy(results: ServerScanResult[], policy: SecurityPolicy | null): ServerScanResult[] {
  if (!policy || !policy.rules || policy.rules.length === 0) return results;

  for (const result of results) {
    let newFindings: Finding[] = [];
    
    for (let finding of result.findings) {
      let skip = false;
      
      for (const rule of policy.rules) {
        let matches = true;
        if (rule.match) {
           for (const [key, val] of Object.entries(rule.match)) {
               if (key === 'server_name') {
                   const sNames = Array.isArray(val) ? val : [val];
                   if (!sNames.includes(result.serverName)) matches = false;
               } else if (key === 'category' || key === 'license_type' || key === 'pii_types') {
                   const arr = Array.isArray(val) ? val : [val];
                   if (!arr.some(v => finding.description.toLowerCase().includes(String(v).toLowerCase()))) {
                       matches = false;
                   }
               }
           }
        } else {
           matches = false;
        }

        if (rule.scanner) {
           if (!finding.id.includes(rule.scanner)) matches = false;
        }

        if (matches) {
           if (rule.action === 'skip') {
              skip = true;
              break;
           }
           if (rule.action === 'override-severity' && rule.severity) {
              finding.severity = rule.severity.toUpperCase() as any;
           }
           if (rule.action === 'warn') {
               finding.severity = 'MEDIUM'; 
               if (!finding.description.startsWith('[WARN')) {
                   finding.description = `[WARN POLICY] ${finding.description}`;
               }
           }
           if (rule.action === 'block') {
               finding.severity = 'CRITICAL';
               if (!finding.description.startsWith('[BLOCKED')) {
                   finding.description = `[BLOCKED BY POLICY] ${finding.description}`;
               }
           }
        }
      }
      
      if (!skip) {
         newFindings.push(finding);
      }
    }
    
    result.findings = newFindings;
  }

  return results;
}