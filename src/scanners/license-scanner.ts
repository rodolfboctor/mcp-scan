import { Finding } from '../types/scan-result.js';
import { SupplyChainResult } from './supply-chain-scanner.js';

/**
 * Scans a package's license for compliance risks.
 * @param metadata The metadata gathered from the supply chain scan.
 * @returns An array of findings related to license risk.
 */
export function scanLicense(metadata: SupplyChainResult['metadata']): Finding[] {
  const findings: Finding[] = [];
  if (!metadata || metadata.source !== 'npm') return findings;

  const license = metadata.license?.toUpperCase();

  if (!license) {
    findings.push({
      id: 'license-risk',
      severity: 'HIGH',
      description: `Package '${metadata.packageName}' has no license specified.`,
      fixRecommendation: 'Unlicensed software carries legal risk for commercial use. Verify the license manually.'
    });
    return findings;
  }

  const copyleftLicenses = ['GPL', 'AGPL', 'LGPL', 'CC-BY-SA', 'EUPL', 'OSL', 'CDDL', 'MPL'];
  const permissiveLicenses = ['MIT', 'APACHE-2.0', 'BSD', 'ISC', 'UNLICENSE', 'WTFPL', '0BSD', 'ZLIB', 'ARTISTIC-2.0', 'PYTHON-2.0'];

  const isCopyleft = copyleftLicenses.some(l => license.includes(l));
  const isPermissive = permissiveLicenses.some(l => license.includes(l));

  if (isCopyleft) {
    findings.push({
      id: 'license-risk',
      severity: 'MEDIUM',
      description: `Package '${metadata.packageName}' uses a copyleft license: ${metadata.license}.`,
      fixRecommendation: 'Copyleft licenses may require you to open-source your derivative works. Review with legal.'
    });
  } else if (!isPermissive && license !== 'SEE LICENSE IN LICENSE' && license !== 'PROPRIETARY') {
    findings.push({
      id: 'license-risk',
      severity: 'LOW',
      description: `Package '${metadata.packageName}' uses a non-standard or unknown license: ${metadata.license}.`,
      fixRecommendation: 'Review the license terms to ensure compatibility with your project.'
    });
  }

  if (license === 'UNLICENSED') {
    findings.push({
      id: 'license-risk',
      severity: 'HIGH',
      description: `Package '${metadata.packageName}' is explicitly marked as UNLICENSED.`,
      fixRecommendation: 'This package may not be used commercially without permission. Seek legal advice.'
    });
  }

  return findings;
}
