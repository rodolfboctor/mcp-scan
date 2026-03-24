import { ResolvedServer } from '../types/config.js';
import { Finding, Severity } from '../types/scan-result.js';

export function scanPromptInjection(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];

  const stringPatterns = [
    'ignore previous instructions', 'ignore all prior', 'you are now',
    'disregard', 'forget your instructions', 'override your'
  ];
  const unicodePatterns = [
    '\u200B', '\uFEFF', '\u202E', '\u00AD'
  ]; // Using escaped unicode for regex
  const toolNamePatterns = [
    'bash', 'python', 'eval', 'exec', 'shell', 'terminal', 'run', 'system'
  ];
  const base64Regex = /[A-Za-z0-9+/]{50,}={0,2}/;

  // Check server description and arguments
  const textToScan = [server.description, ...Object.values(server.args || {})].filter(Boolean).join(' ');

  // String patterns
  for (const pattern of stringPatterns) {
    if (textToScan.toLowerCase().includes(pattern)) {
      findings.push({
        id: 'prompt-injection-pattern',
        severity: 'HIGH' as Severity,
        description: `Potential prompt injection string pattern detected: "${pattern}".`,
        fixRecommendation: 'Review the server description and arguments for suspicious phrases that could lead to prompt injection.',
      });
    }
  }

  // Unicode patterns
  for (const pattern of unicodePatterns) {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(textToScan)) {
      findings.push({
        id: 'unicode-injection',
        severity: 'HIGH' as Severity,
        description: `Potential unicode injection pattern detected: "${pattern}".`,
        fixRecommendation: 'Review the server description and arguments for suspicious unicode characters that could be used for obfuscation.',
      });
    }
  }

  // Base64 patterns (longer than 50 chars)
  const base64Matches = textToScan.match(base64Regex);
  if (base64Matches && base64Matches.length > 0) {
    findings.push({
      id: 'prompt-injection-pattern',
      severity: 'HIGH' as Severity,
      description: `Potential prompt injection (Base64-like string > 50 chars) detected.`,
      fixRecommendation: 'Review the server description and arguments for long Base64-like encoded strings that could hide malicious instructions.',
    });
  }


  // Tool name shadows
  for (const toolName of toolNamePatterns) {
    // Check if toolName exists as a key in server.args, but it is not defined in server.schema
    // This requires schema analysis which is more complex.
    // For now, let's just check if the tool name appears in the text.
    if (textToScan.toLowerCase().includes(toolName)) {
        findings.push({
            id: 'tool-name-shadow',
            severity: 'MEDIUM' as Severity,
            description: `Potential tool name shadowing detected: "${toolName}".`,
            fixRecommendation: 'Ensure tool names are not mimicked or used in a misleading way in descriptions or arguments.',
        });
    }
  }

  // Schema bypass risk: additionalProperties: true at schema root
  if (server.schema && server.schema.additionalProperties === true) {
    findings.push({
      id: 'schema-bypass-risk',
      severity: 'LOW' as Severity,
      description: 'Schema allows additional properties, which might pose a schema bypass risk.',
      fixRecommendation: 'Consider restricting additional properties in the schema to enhance security and prevent unexpected inputs.',
    });
  }

  return findings;
}
