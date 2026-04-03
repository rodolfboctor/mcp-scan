export const HIPAA_MAPPING = {
  id: 'hipaa',
  name: 'HIPAA (Health Insurance Portability and Accountability Act)',
  controls: [
    { id: '164.312(a)(1)', description: 'Access Control', findingIds: ['exposed-secret', 'credential-relay-risk', 'env-var-scope-leak'] },
    { id: '164.312(a)(2)(iv)', description: 'Encryption/Decryption', findingIds: ['data-controls-encryption-gap', 'insecure-transport'] },
    { id: '164.312(b)', description: 'Audit Controls', findingIds: ['data-controls-prompt-logging', 'network-egress-unknown', 'network-egress-suspicious'] },
    { id: '164.312(e)(1)', description: 'Transmission Security', findingIds: ['data-exfiltration-risk', 'network-egress-obfuscated', 'network-egress-raw-ip'] }
  ]
};
