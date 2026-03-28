export const NIST_MAPPING = {
  id: 'nist',
  name: 'NIST 800-53 Rev 5',
  controls: [
    { id: 'AC', description: 'Access Control', findingIds: ['excessive-permissions', 'exposed-secret', 'credential-relay-risk'] },
    { id: 'AU', description: 'Audit and Accountability', findingIds: ['data-controls-prompt-logging', 'network-egress-suspicious'] },
    { id: 'SC', description: 'System and Communications Protection', findingIds: ['data-controls-encryption-gap', 'data-exfiltration-risk', 'network-egress-obfuscated'] },
    { id: 'SI', description: 'System and Information Integrity', findingIds: ['malicious-package', 'known-vulnerability-critical', 'prompt-injection-pattern'] }
  ]
};