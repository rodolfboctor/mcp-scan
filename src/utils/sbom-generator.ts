import { ScanReport } from '../types/scan-result.js';
import { v4 as uuidv4 } from 'uuid';

interface CycloneDXComponent {
  type: string;
  name: string;
  version: string;
  bomRef: string;
  purl: string;
  description: string;
  licenses?: Array<{ license: { id: string } }>;
  author?: string;
  externalReferences?: Array<{ type: string; url: string }>;
  hashes?: Array<{ alg: string; content: string }>;
}

interface CycloneDXVulnerability {
  id: string;
  source: { name: string; url: string };
  description: string;
  recommendation?: string;
  ratings: Array<{ score: number; severity: string; method: string }>;
  analysis: { state: string; detail: string };
  affects: Array<{ ref: string }>;
}

interface CycloneDXBom {
  bomFormat: string;
  specVersion: string;
  serialNumber: string;
  version: number;
  metadata: { timestamp: string; tools: Array<{ vendor: string; name: string; version: string }> };
  components: CycloneDXComponent[];
  vulnerabilities?: CycloneDXVulnerability[];
}

export async function generateSbom(report: ScanReport, options: { includeFindings?: boolean } = {}): Promise<CycloneDXBom> {
  const version = report.version || '2.0.0';
  const timestamp = new Date().toISOString();
  
  const components = report.results.map(result => {
    const meta = result.metadata;
    const name = meta?.packageName || result.serverName;
    const componentVersion = meta?.version || '0.0.0';
    
    const component: CycloneDXComponent = {
      type: 'application',
      name: name,
      version: componentVersion,
      bomRef: `pkg:npm/${name}@${componentVersion}`,
      purl: `pkg:npm/${name}@${componentVersion}`,
      description: `MCP Server: ${result.serverName} (detected in ${result.toolName})`,
    };

    if (meta?.license) {
      component.licenses = [{ license: { id: meta.license } }];
    }

    if (meta?.author) component.author = meta.author;

    if (meta?.repositoryUrl) {
      component.externalReferences = [{ type: 'vcs', url: meta.repositoryUrl }];
    }

    if (meta?.integrity) {
       component.hashes = [{ alg: 'SHA-512', content: meta.integrity }];
    }

    return component;
  });

  const vulnerabilities: CycloneDXVulnerability[] = [];
  if (options.includeFindings) {
      for (const result of report.results) {
          const componentRef = `pkg:npm/${result.metadata?.packageName || result.serverName}@${result.metadata?.version || '0.0.0'}`;
          for (const finding of result.findings) {
              vulnerabilities.push({
                  id: finding.id,
                  source: { name: 'mcp-scan', url: 'https://github.com/rodolfboctor/mcp-scan' },
                  description: finding.description,
                  recommendation: finding.fixRecommendation,
                  ratings: [{
                      score: mapSeverityToScore(finding.severity),
                      severity: finding.severity.toLowerCase(),
                      method: 'CVSSv3'
                  }],
                  analysis: {
                      state: 'confirmed',
                      detail: `Detected in MCP server configuration: ${result.serverName}`
                  },
                  affects: [{ ref: componentRef }]
              });
          }
      }
  }

  const sbom: CycloneDXBom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: `urn:uuid:${uuidv4()}`,
    version: 1,
    metadata: {
      timestamp: timestamp,
      tools: [{ vendor: 'ThynkQ', name: 'mcp-scan', version: version }]
    },
    components: components
  };

  if (vulnerabilities.length > 0) {
      sbom.vulnerabilities = vulnerabilities;
  }

  return sbom;
}

/**
 * Generates an SPDX 2.3 tag-value document from the scan report.
 */
export function generateSpdx(report: ScanReport): string {
  const timestamp = new Date().toISOString();
  const docNamespace = `http://spdx.org/spdxdocs/mcp-scan-sbom-${uuidv4()}`;

  const lines: string[] = [
    'SPDXVersion: SPDX-2.3',
    'DataLicense: CC0-1.0',
    'SPDXID: SPDXRef-DOCUMENT',
    'DocumentName: mcp-scan-sbom',
    `DocumentNamespace: ${docNamespace}`,
    `Creator: Tool: mcp-scan-${report.version || '2.0.0'}`,
    `Created: ${timestamp}`,
    '',
  ];

  for (const result of report.results) {
    const name = result.metadata?.packageName || result.serverName;
    const version = result.metadata?.version || '0.0.0';
    const spdxId = `SPDXRef-${name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const downloadUrl = result.metadata?.packageName
      ? `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`
      : 'NOASSERTION';

    lines.push(
      `PackageName: ${name}`,
      `SPDXID: ${spdxId}`,
      `PackageVersion: ${version}`,
      `PackageDownloadLocation: ${downloadUrl}`,
      'FilesAnalyzed: false',
      result.metadata?.license ? `PackageLicenseConcluded: ${result.metadata.license}` : 'PackageLicenseConcluded: NOASSERTION',
      'PackageLicenseDeclared: NOASSERTION',
      'PackageCopyrightText: NOASSERTION',
      ''
    );
  }

  return lines.join('\n');
}

function mapSeverityToScore(severity: string): number {
    switch (severity.toUpperCase()) {
        case 'CRITICAL': return 9.5;
        case 'HIGH': return 7.5;
        case 'MEDIUM': return 5.5;
        case 'LOW': return 3.5;
        default: return 1.0;
    }
}
