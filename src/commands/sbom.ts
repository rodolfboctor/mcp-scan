import { runScan } from './scan.js';
import { generateSbom } from '../utils/sbom-generator.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

/**
 * Generates a Software Bill of Materials (SBOM) from mcp-scan results.
 *
 * CycloneDX v1.5 (JSON) — uses the custom generator in sbom-generator.ts.
 * SPDX 2.3 (tag-value text) — generated inline; @spdx/tools has no build() API.
 */
export async function runSbom(options: {
  format: 'cyclonedx' | 'spdx';
  output: string;
  includeDeps?: boolean;
}) {
  const report = await runScan({ silent: true });

  if (options.format === 'cyclonedx') {
    const sbom = await generateSbom(report);
    fs.writeFileSync(options.output, JSON.stringify(sbom, null, 2));
    console.log(`CycloneDX SBOM saved to ${options.output}`);
  } else if (options.format === 'spdx') {
    const spdxText = generateSpdx(report);
    fs.writeFileSync(options.output, spdxText);
    console.log(`SPDX SBOM saved to ${options.output}`);
  }
}

/**
 * Generates an SPDX 2.3 tag-value document from the scan report.
 * Keeps the output minimal but spec-compliant.
 */
function generateSpdx(report: any): string {
  const timestamp = new Date().toISOString();
  const docNamespace = `http://spdx.org/spdxdocs/mcp-scan-sbom-${uuidv4()}`;

  const lines: string[] = [
    'SPDXVersion: SPDX-2.3',
    'DataLicense: CC0-1.0',
    `SPDXID: SPDXRef-DOCUMENT`,
    `DocumentName: mcp-scan-sbom`,
    `DocumentNamespace: ${docNamespace}`,
    `Creator: Tool: mcp-scan-${report.version || '2.0.0'}`,
    `Created: ${timestamp}`,
    '',
  ];

  for (const result of report.results) {
    const name = result.metadata?.packageName || result.serverName;
    const version = result.metadata?.version || 'NOASSERTION';
    const spdxId = `SPDXRef-${name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const downloadUrl = result.metadata?.packageName
      ? `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`
      : 'NOASSERTION';

    lines.push(
      `PackageName: ${name}`,
      `SPDXID: ${spdxId}`,
      `PackageVersion: ${version}`,
      `PackageDownloadLocation: ${downloadUrl}`,
      `FilesAnalyzed: false`,
      result.metadata?.license ? `PackageLicenseConcluded: ${result.metadata.license}` : 'PackageLicenseConcluded: NOASSERTION',
      'PackageLicenseDeclared: NOASSERTION',
      `PackageCopyrightText: NOASSERTION`,
      '',
    );
  }

  return lines.join('\n');
}
