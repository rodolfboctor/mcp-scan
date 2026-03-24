import { ResolvedServer } from '../types/config.js';
import { Finding, FindingId, Severity } from '../types/scan-result.js';

const PROMPT_INJECTION_PATTERNS = [
  "ignore previous instructions",
  "ignore all prior",
  "you are now",
  "disregard",
  "forget your instructions",
  "override your"
];

const UNICODE_INJECTION_PATTERNS = [
  "\u200B", // Zero Width Space
  "\uFEFF", // Zero Width No-Break Space (Byte Order Mark)
  "\u202E", // Right-to-Left Override
  "\u00AD"  // Soft Hyphen
];

const BASE64_REGEX = /[A-Za-z0-9+/]{50,}={0,2}/;

const TOOL_NAME_PATTERNS = [
  "bash",
  "python",
  "eval",
  "exec",
  "shell",
  "terminal",
  "run",
  "system"
];

export function scanPromptInjection(server: ResolvedServer): Finding[] {
  const findings: Finding[] = [];

  const addFinding = (id: FindingId, severity: Severity, description: string, path?: string) => {
    findings.push({ id, severity, description, path });
  };

  // Check for prompt injection patterns in tool descriptions
  if (server.description) {
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (server.description.toLowerCase().includes(pattern)) {
        addFinding('prompt-injection-pattern', 'HIGH', `Potential prompt injection pattern found in server description: "${pattern}"`);
      }
    }
    for (const pattern of UNICODE_INJECTION_PATTERNS) {
      if (server.description.includes(pattern)) {
        addFinding('unicode-injection', 'HIGH', `Unicode injection character found in server description: "${pattern}"`);
      }
    }
    if (BASE64_REGEX.test(server.description)) {
      addFinding('prompt-injection-pattern', 'HIGH', 'Long Base64 encoded string found in server description, potentially obfuscated prompt injection.');
    }
    for (const pattern of TOOL_NAME_PATTERNS) {
      if (server.description.toLowerCase().includes(pattern)) {
        addFinding('tool-name-shadow', 'MEDIUM', `Tool name shadowing pattern found in server description: "${pattern}"`);
      }
    }
  }

  // Check for additionalProperties: true at schema root or in args
  const checkSchemaForAdditionalProperties = (schema: any, path: string) => {
    if (schema && schema.additionalProperties === true) {
      addFinding('schema-bypass-risk', 'LOW', `'additionalProperties: true' found at ${path}, potentially allowing schema bypass.`, path);
    }
  };

  if (server.schema) {
    checkSchemaForAdditionalProperties(server.schema, 'server.schema');
    if (server.schema.properties) {
      for (const propKey of Object.keys(server.schema.properties)) {
        checkSchemaForAdditionalProperties(server.schema.properties[propKey], `server.schema.properties.${propKey}`);
      }
    }
  }

  if (server.args) {
    // Assuming server.args can also contain schema-like objects
    // This part might need refinement based on actual structure of server.args
    checkSchemaForAdditionalProperties(server.args, 'server.args');
    if (server.args.properties) {
      for (const propKey of Object.keys(server.args.properties)) {
        checkSchemaForAdditionalProperties(server.args.properties[propKey], `server.args.properties.${propKey}`);
      }
    }
  }

  return findings;
}
