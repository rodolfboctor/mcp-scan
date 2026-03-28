export const GDPR_MAPPING = {
  id: 'gdpr',
  name: 'GDPR',
  controls: [
    { id: 'Article 5', description: 'Principles relating to processing of personal data', findingIds: ['data-controls-retention-gap', 'data-controls-old-temp-files'] },
    { id: 'Article 6', description: 'Lawfulness of processing', findingIds: ['data-controls-consent-gap'] },
    { id: 'Article 25', description: 'Data protection by design and by default', findingIds: ['data-controls-pii', 'data-controls-sharing'] },
    { id: 'Article 32', description: 'Security of processing', findingIds: ['data-controls-encryption-gap', 'exposed-secret', 'data-exfiltration-risk'] },
    { id: 'Article 35', description: 'Data protection impact assessment', findingIds: ['data-controls-deletion-gap'] }
  ]
};