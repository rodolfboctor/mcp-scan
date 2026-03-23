import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

export function scanAst(server: ResolvedServer): Finding[] {
  if (!server.command) return [];
  const findings: Finding[] = [];
  const fullCommand = [server.command, ...(server.args || [])].join(' ');

  // 1. Detect suspicious shells and execution patterns
  if (/(bash|sh|zsh)\s+-c/i.test(fullCommand) || /\b(eval|exec)\b/i.test(fullCommand)) {
    findings.push({
      id: 'suspicious-execution',
      severity: 'HIGH',
      description: `Command contains suspicious execution patterns (e.g., bash -c, eval, exec).`,
    });
  }

  // 2. Detect data exfiltration tools
  if (/\|\s*(curl|wget)/i.test(fullCommand) || /\b(curl|wget)\b.*\|/i.test(fullCommand)) {
    findings.push({
      id: 'data-exfiltration-risk',
      severity: 'CRITICAL',
      description: `Command pipes data to or from a network request tool (curl, wget), posing an exfiltration risk.`,
    });
  }

  // 3. Detect reverse shells
  if (/\b(nc|netcat)\b/i.test(fullCommand)) {
    findings.push({
      id: 'reverse-shell-risk',
      severity: 'CRITICAL',
      description: `Command contains 'nc' or 'netcat', which could be used for a reverse shell.`,
    });
  }

  // 4. Detect Python dangerous functions in inline code
  if (/\bpython\d*\b.*-c.*(exec|eval)\s*\(/i.test(fullCommand)) {
    findings.push({
      id: 'python-inline-execution',
      severity: 'CRITICAL',
      description: `Python inline command uses dangerous functions like exec() or eval().`,
    });
  }

  // 5. Detect Node.js inline code execution
  if (/\bnode\b.*-e/i.test(fullCommand)) {
    findings.push({
      id: 'node-inline-execution',
      severity: 'HIGH',
      description: `Node.js is running inline code via the -e flag, which can be difficult to audit.`,
    });
  }
  
  // 6. Detect sensitive directory globbing in arguments
  if (server.args) {
      for (const arg of server.args) {
          if (/\/\*\*/.test(arg) && /(\.ssh|\.aws|\.gnupg|\.env)/.test(arg)) {
            findings.push({
              id: 'sensitive-glob-pattern',
              severity: 'HIGH',
              description: `Argument contains a glob pattern that may expose sensitive directories: '${arg}'.`,
            });
          }
      }
  }

  return findings;
}
