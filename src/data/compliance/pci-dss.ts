export const PCI_DSS_MAPPING = {
  id: 'pci-dss',
  name: 'PCI-DSS v4.0',
  controls: [
    { id: 'Req 3', description: 'Protect Stored Account Data', findingIds: ['data-controls-pii', 'data-controls-encryption-gap', 'temp-storage-risk'] },
    { id: 'Req 4', description: 'Protect Transmissions', findingIds: ['data-exfiltration-risk', 'network-egress-raw-ip'] },
    { id: 'Req 6', description: 'Secure Systems and Software', findingIds: ['malicious-package', 'known-vulnerability-critical', 'known-vulnerability-high', 'prompt-injection-pattern'] },
    { id: 'Req 10', description: 'Log and Monitor All Access', findingIds: ['data-controls-prompt-logging', 'network-egress-suspicious'] }
  ]
};