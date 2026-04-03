export const PCI_DSS_MAPPING = {
  id: 'pci-dss',
  name: 'PCI DSS (Payment Card Industry Data Security Standard)',
  controls: [
    { id: 'Req 3', description: 'Protect Stored Account Data', findingIds: ['data-controls-encryption-gap', 'data-controls-retention-gap', 'data-controls-pii'] },
    { id: 'Req 4', description: 'Encrypt Transmission of Cardholder Data', findingIds: ['insecure-transport', 'network-egress-obfuscated', 'data-exfiltration-risk'] },
    { id: 'Req 7', description: 'Restrict Access to Data', findingIds: ['exposed-secret', 'credential-relay-risk', 'env-var-scope-leak'] },
    { id: 'Req 10', description: 'Track and Monitor Access', findingIds: ['data-controls-prompt-logging', 'network-egress-unknown', 'network-egress-suspicious'] }
  ]
};
