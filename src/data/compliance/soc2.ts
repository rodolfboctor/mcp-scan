export const SOC2_MAPPING = {
  id: 'soc2',
  name: 'SOC 2 Type II',
  controls: [
    { id: 'CC6.1', description: 'Logical Access', findingIds: ['exposed-secret', 'excessive-permissions', 'credential-relay-risk', 'env-var-scope-leak'] },
    { id: 'CC6.6', description: 'External Threats', findingIds: ['malicious-package', 'typosquatting-package', 'known-vulnerability-critical', 'known-vulnerability-high', 'prompt-injection-pattern', 'tool-name-shadow'] },
    { id: 'CC6.7', description: 'Data Transmission', findingIds: ['network-egress-obfuscated', 'network-egress-raw-ip', 'data-exfiltration-risk', 'data-controls-encryption-gap'] },
    { id: 'CC7.2', description: 'Monitoring', findingIds: ['network-egress-unknown', 'network-egress-suspicious', 'data-controls-prompt-logging'] }
  ]
};