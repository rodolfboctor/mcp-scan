import { SOC2_MAPPING } from './soc2.js';
import { GDPR_MAPPING } from './gdpr.js';
import { HIPAA_MAPPING } from './hipaa.js';
import { PCI_DSS_MAPPING } from './pci-dss.js';
import { NIST_MAPPING } from './nist.js';

export const COMPLIANCE_FRAMEWORKS = [
  SOC2_MAPPING,
  GDPR_MAPPING,
  HIPAA_MAPPING,
  PCI_DSS_MAPPING,
  NIST_MAPPING
];

export function getFramework(id: string) {
  return COMPLIANCE_FRAMEWORKS.find(f => f.id === id);
}