import { runScan } from './scan.js';
import { generateSbom, generateSpdx } from '../utils/sbom-generator.js';
import fs from 'fs';

/**
 * Generates a Software Bill of Materials (SBOM) from mcp-scan results.
 * Supports CycloneDX v1.5 (JSON) and SPDX 2.3 (tag-value).
 */
export async function runSbom(options: {
  format: 'cyclonedx' | 'spdx';
  output: string;
  includeDeps?: boolean;
  includeFindings?: boolean;
}) {
  const report = await runScan({ silent: true });

  try {
    if (options.format === 'cyclonedx') {
      const sbom = await generateSbom(report, { includeFindings: options.includeFindings });
      fs.writeFileSync(options.output, JSON.stringify(sbom, null, 2));
      console.log(`CycloneDX SBOM written to ${options.output} (${report.totalScanned} components)`);
    } else if (options.format === 'spdx') {
      const spdxText = generateSpdx(report);
      fs.writeFileSync(options.output, spdxText);
      console.log(`SPDX SBOM written to ${options.output} (${report.totalScanned} components)`);
    } else {
      console.error(`Error: Unsupported SBOM format '${options.format}'. Supported formats: cyclonedx, spdx`);
      process.exitCode = 1;
    }
  } catch (err: unknown) {
    console.error(`Error writing SBOM: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
