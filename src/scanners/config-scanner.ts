import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

export function scanConfig(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];
  
  if (server.args) {
    for (const arg of server.args) {
      // Flag $(command) or `command` or complex ${...} but allow simple ${VAR}
      const isSimpleEnvVar = /^\$\{[A-Z0-9_]+\}$/.test(arg);
      const hasInjection = /\$\(.*\)|`.*`/.test(arg) || (/\$\{.*\}/.test(arg) && !isSimpleEnvVar);
      
      if (hasInjection) {
        findings.push({
          id: 'shell-injection-risk',
          severity: 'CRITICAL',
          description: `Argument contains potential shell injection patterns (\${...}, $(...), or backticks): '${arg}'`,
        });
      }
    }

    if (server.args.length > 20) {
      findings.push({
        id: 'large-arg-list',
        severity: 'LOW',
        description: `Server has a suspiciously large number of arguments (${server.args.length}).`,
      });
    }
  }

  // Check for missing env vars mentioned in args (very basic heuristic)
  if (server.args) {
    for (const arg of server.args) {
      const match = arg.match(/\$([A-Z0-9_]+)/);
      if (match) {
        const envVar = match[1];
        if (!server.env || (!(envVar in server.env) && !(envVar in process.env))) {
           findings.push({
            id: 'missing-env-var',
            severity: 'MEDIUM',
            description: `Server config references environment variable '${envVar}' which is not set in config.`,
          });
        }
      }
    }
  }

  return findings;
}
