import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

/**
 * Static analysis for reverse shells, eval() abuse, and data exfiltration.
 * Upgraded to include cross-origin exfiltration analysis.
 */
export function scanAst(server: ResolvedServer, allowedDomains: string[] = []): Finding[] {
  if (!server.command) return [];
  const findings: Finding[] = [];
  const argsArray = server.args ? (Array.isArray(server.args) ? server.args : Object.values(server.args)) : [];
  const fullCommand = [server.command, ...argsArray].join(' ');

  // 1. Detect suspicious shells and execution patterns
  if (/(bash|sh|zsh|fish|ksh|csh)\s+-c/i.test(fullCommand) || /\b(eval|exec)\b/i.test(fullCommand)) {
    findings.push({
      id: 'suspicious-execution',
      severity: 'HIGH',
      description: `Command contains suspicious execution patterns (e.g., bash -c, eval, exec).`,
      fixRecommendation: 'Avoid shell -c patterns. Use direct process execution with explicit arguments instead.',
    });
  }

  // 2. Detect data exfiltration tools
  if (/\|\s*(curl|wget|nc|netcat|socat)/i.test(fullCommand) || /\b(curl|wget)\b.*\|/i.test(fullCommand)) {
    findings.push({
      id: 'data-exfiltration-risk',
      severity: 'CRITICAL',
      description: `Command pipes data to or from a network transfer tool (curl, wget, nc, netcat, socat). High exfiltration risk.`,
      fixRecommendation: 'Never pipe sensitive data to network tools. Use authenticated HTTPS APIs instead.',
    });
  }

  // 3. Detect network calls to external IPs/domains in tool args
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
  const domainRegex = /\b(?:https?:\/\/)?(?:[\w-]+\.)+[\w-]{2,}\b/;
  
  let hasNetworkEndpoint = false;
  let hasEnvVarInArgs = false;

  for (const arg of argsArray) {
    if (typeof arg !== 'string') continue;
    
    const hasIp = ipRegex.test(arg);
    const hasExternalDomain = domainRegex.test(arg) && !arg.includes('localhost') && !arg.includes('127.0.0.1') && !allowedDomains.some(d => arg.includes(d));
    
    if (hasIp || hasExternalDomain) {
      hasNetworkEndpoint = true;
      findings.push({
        id: 'exfiltration-vector',
        severity: 'MEDIUM',
        description: `Tool argument contains a potential external network endpoint: '${arg}'.`,
        fixRecommendation: 'Review if this tool should be making outbound network calls to this endpoint.'
      });
    }

    if (/\$\{([A-Z0-9_]+)\}/.test(arg)) {
      hasEnvVarInArgs = true;
    }
  }

  // 4. Detect tools that pass env vars while having a network call
  if (hasNetworkEndpoint && hasEnvVarInArgs) {
    findings.push({
      id: 'exfiltration-vector',
      severity: 'HIGH',
      description: `Tool passes environment variables in arguments while also referencing an external network endpoint.`,
      fixRecommendation: 'This is a high-risk exfiltration vector. Avoid passing secrets or identifiers to external endpoints in arguments.'
    });
  }

  // 5. Flag tools with both filesystem READ access AND network access
  const hasFilesystemAccess = argsArray.some(arg => 
    typeof arg === 'string' && (arg === '/' || arg === '~' || arg.startsWith('/Users') || arg.startsWith('/home') || arg.includes('.ssh') || arg.includes('.env'))
  );
  
  const hasNetworkAccess = hasNetworkEndpoint || (/curl|wget|fetch|axios|http|https/i.test(fullCommand) && !allowedDomains.some(d => fullCommand.includes(d)));
  
  if (hasFilesystemAccess && hasNetworkAccess) {
    findings.push({
      id: 'exfiltration-vector',
      severity: 'HIGH',
      description: 'Tool has both filesystem access and network access capabilities, which is a prime exfiltration vector.',
      fixRecommendation: 'Restrict the tool to either filesystem access or network access, but not both if possible.'
    });
  }

  // 6. Detect reverse shells
  if (/\b(nc|netcat)\b/i.test(fullCommand)) {
    findings.push({
      id: 'reverse-shell-risk',
      severity: 'CRITICAL',
      description: `Command contains 'nc' or 'netcat', which could be used for a reverse shell.`,
    });
  }

  // 7. Detect Python dangerous functions in inline code
  if (/\bpython\d*\b.*-c.*(exec|eval)\s*\(/i.test(fullCommand)) {
    findings.push({
      id: 'python-inline-execution',
      severity: 'CRITICAL',
      description: `Python inline command uses dangerous functions like exec() or eval().`,
    });
  }

  // 8. Detect Node.js inline code execution
  if (/\bnode\b.*-e/i.test(fullCommand)) {
    findings.push({
      id: 'node-inline-execution',
      severity: 'HIGH',
      description: `Node.js is running inline code via the -e flag, which can be difficult to audit.`,
    });
  }
  
  // 9. Detect sensitive directory globbing in arguments
  for (const arg of argsArray) {
      if (typeof arg === 'string' && /\/\*\*/.test(arg) && /(\.ssh|\.aws|\.gnupg|\.env)/.test(arg)) {
        findings.push({
          id: 'sensitive-glob-pattern',
          severity: 'HIGH',
          description: `Argument contains a glob pattern that may expose sensitive directories: '${arg}'.`,
        });
      }
  }

  return findings;
}
