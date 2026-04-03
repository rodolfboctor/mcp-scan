export const NIST_MAPPING = {
  id: 'nist',
  name: 'NIST Cybersecurity Framework (CSF)',
  controls: [
    { id: 'ID.AM-1', description: 'Inventory of Physical Devices', findingIds: ['duplicate-server', 'unauthorized-config-change'] },
    { id: 'PR.AC-1', description: 'Access Control', findingIds: ['exposed-secret', 'credential-relay-risk', 'env-var-scope-leak'] },
    { id: 'PR.DS-1', description: 'Data-at-Rest Protection', findingIds: ['data-controls-encryption-gap'] },
    { id: 'PR.DS-2', description: 'Data-in-Transit Protection', findingIds: ['insecure-transport', 'tls-version-vulnerable', 'data-exfiltration-risk'] },
    { id: 'DE.CM-1', description: 'Network Monitoring', findingIds: ['network-egress-unknown', 'network-egress-suspicious', 'network-egress-obfuscated'] }
  ]
};
