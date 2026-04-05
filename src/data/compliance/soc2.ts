export const SOC2_MAPPING = {
  id: 'soc2',
  name: 'SOC 2 Type II (Security, Availability, Confidentiality)',
  controls: [
    { id: 'CC6.1', description: 'Logical Access Control', findingIds: ['exposed-secret', 'credential-relay-risk', 'env-var-scope-leak', 'secret-pattern-match'] },
    { id: 'CC6.6', description: 'Boundary Protection', findingIds: ['malicious-package', 'typosquatting-package', 'known-vulnerability-critical', 'known-vulnerability-high', 'prompt-injection-pattern', 'tool-name-shadow', 'supply-chain-malicious'] },
    { id: 'CC6.7', description: 'Transmission Protection', findingIds: ['network-egress-obfuscated', 'network-egress-raw-ip', 'data-exfiltration-risk', 'data-controls-encryption-gap', 'insecure-transport', 'tls-version-vulnerable'] },
    { id: 'CC7.2', description: 'Security Monitoring', findingIds: ['network-egress-unknown', 'network-egress-suspicious', 'data-controls-prompt-logging', 'network-egress-data-in-url'] },
    { id: 'CC8.1', description: 'Change Management', findingIds: ['config-drift', 'duplicate-server', 'unauthorized-config-change'] },
    { id: 'CC9.1', description: 'Risk Mitigation', findingIds: ['malicious-package', 'supply-chain-malicious', 'typosquatting-package', 'known-vulnerability-critical'] },
    { id: 'A1.1', description: 'Availability Commitments', findingIds: ['network-egress-unknown', 'data-exfiltration-risk'] }
  ]
};
