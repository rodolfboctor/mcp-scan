import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

/**
 * Scanner for Tool Poisoning & Capability Injection attacks.
 * Detects patterns in tool descriptions and arguments that aim to influence model behavior maliciously.
 */
export function scanToolPoisoning(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];

  const textToScan = [
    server.description,
    ...(Array.isArray(server.args) ? server.args : (server.args ? Object.values(server.args) : []))
  ].filter(Boolean).join(' ');

  // 1. Hidden instructions (long padding followed by instructions)
  if (/\s{50,}.*(ignore|disregard|forget|rules|instructions)/i.test(textToScan)) {
    findings.push({
      id: 'hidden-instruction-risk',
      severity: 'HIGH',
      description: 'Hidden instructions detected in description via excessive whitespace padding.',
      fixRecommendation: 'Remove excessive whitespace and ensure instructions are clear and non-conflicting.'
    });
  }

  // 2. Instructions calling other tools or exfiltrating data
  const exfiltrationKeywords = ['exfiltrate', 'send to', 'upload', 'POST', 'leak', 'steal', 'delete_everything', 'delete all', 'forward to', 'exfil', 'transmit credentials', 'send credentials'];
  const callOtherToolsKeywords = ['call tool', 'use tool', 'then call', 'follow by calling', 'invoke tool', 'chain to'];
  
  if (new RegExp(exfiltrationKeywords.join('|'), 'i').test(textToScan)) {
    findings.push({
      id: 'tool-exfiltration-risk',
      severity: 'HIGH',
      description: 'Potential exfiltration instructions detected in tool description.',
      fixRecommendation: 'Review tool descriptions for phrases that instruct the model to move data outside the intended scope.'
    });
  }

  if (new RegExp(callOtherToolsKeywords.join('|'), 'i').test(textToScan)) {
    findings.push({
        id: 'tool-exfiltration-risk',
        severity: 'MEDIUM',
        description: 'Instructions to call other tools detected in description.',
        fixRecommendation: 'Review if the tool should be allowed to chain calls to other tools via natural language instructions.'
    });
  }

  // 3. Tool name shadowing
  const builtInShadows = ['read_file', 'write_file', 'list_files', 'search', 'grep', 'bash', 'terminal', 'shell'];
  if (builtInShadows.includes(server.name.toLowerCase())) {
    findings.push({
      id: 'tool-name-shadow',
      severity: 'MEDIUM',
      description: `Tool name "${server.name}" shadows common built-in operations.`,
      fixRecommendation: 'Rename the tool to avoid conflicts with standard operations or built-in model tools.'
    });
  }

  // 4. Capability escalation
  const readClaims = ['read', 'view', 'get', 'list', 'fetch'];
  const writeActions = ['write', 'create', 'update', 'delete', 'modify', 'save'];
  
  const hasReadClaim = new RegExp(readClaims.join('|'), 'i').test(textToScan);
  const hasWriteAction = new RegExp(writeActions.join('|'), 'i').test(textToScan);
  
  if (hasReadClaim && hasWriteAction && !server.name.toLowerCase().includes('write') && !server.name.toLowerCase().includes('update')) {
    findings.push({
      id: 'capability-escalation-risk',
      severity: 'HIGH',
      description: 'Potential capability escalation: tool claims to be a reader but description contains write/modify instructions.',
      fixRecommendation: 'Ensure tool descriptions accurately reflect their capabilities and do not mislead the model into performing extra actions.'
    });
  }

  // 5. Unicode direction-reversal tricks
  const unicodeTricks = ['\u202E', '\u200F', '\u202B', '\u202D'];
  for (const char of unicodeTricks) {
    if (textToScan.includes(char)) {
      findings.push({
        id: 'unicode-injection',
        severity: 'HIGH',
        description: 'Unicode direction-reversal trick detected in tool description.',
        fixRecommendation: 'Remove hidden or misleading unicode characters that change how text is displayed vs how it is parsed.'
      });
      break;
    }
  }

  // 6. Base64 or hex-encoded instructions
  const base64Regex = /[A-Za-z0-9+/]{50,}={0,2}/;
  if (base64Regex.test(textToScan)) {
    findings.push({
      id: 'prompt-injection-pattern',
      severity: 'HIGH',
      description: 'Long encoded string (potential hidden instructions) detected.',
      fixRecommendation: 'Decode and review any long opaque strings in tool descriptions or arguments.'
    });
  }

  // 7. References to environment variables not in scope
  const envVarRefRegex = /\$\{([A-Z0-9_]+)\}/g;
  let match;
  while ((match = envVarRefRegex.exec(textToScan)) !== null) {
    const envVarName = match[1];
    if (!server.env || !server.env[envVarName]) {
      findings.push({
        id: 'env-var-scope-leak',
        severity: 'MEDIUM',
        description: `Reference to environment variable "\${${envVarName}}" not defined in this server's scope.`,
        fixRecommendation: 'Only reference environment variables that are explicitly provided to the server in its "env" configuration.'
      });
    }
  }

  return findings;
}
