export const GDPR_MAPPING = {
  id: 'gdpr',
  name: 'GDPR (General Data Protection Regulation)',
  controls: [
    { id: 'Art.5', description: 'Data Minimization', findingIds: ['data-controls-minimization-risk', 'data-controls-pii', 'temp-storage-risk'] },
    { id: 'Art.17', description: 'Right to Erasure', findingIds: ['data-controls-deletion-gap', 'data-controls-retention-gap'] },
    { id: 'Art.25', description: 'Privacy by Design', findingIds: ['data-controls-consent-gap', 'data-controls-encryption-gap', 'data-controls-prompt-logging'] },
    { id: 'Art.32', description: 'Security of Processing', findingIds: ['data-exfiltration-risk', 'network-egress-obfuscated', 'credential-relay-risk', 'exposed-secret'] },
    { id: 'Art.44', description: 'Cross-Border Transfers', findingIds: ['network-egress-unknown', 'network-egress-suspicious', 'network-egress-raw-ip'] }
  ]
};
