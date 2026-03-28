export const HIPAA_MAPPING = {
  id: 'hipaa',
  name: 'HIPAA Security Rule',
  controls: [
    { id: '164.312(a)', description: 'Access Control', findingIds: ['excessive-permissions', 'credential-relay-risk', 'exposed-secret'] },
    { id: '164.312(b)', description: 'Audit Controls', findingIds: ['network-egress-telemetry', 'network-egress-unknown', 'data-controls-prompt-logging'] },
    { id: '164.312(e)', description: 'Transmission Security', findingIds: ['data-controls-encryption-gap', 'data-exfiltration-risk', 'network-egress-obfuscated'] }
  ]
};