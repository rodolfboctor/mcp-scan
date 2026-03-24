import { ScanReport } from '../types/scan-result.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a CycloneDX v1.5 SBOM from the scan report.
 * @param report The scan report.
 * @returns The CycloneDX JSON object.
 */
export async function generateSbom(report: ScanReport): Promise<any> {
  const version = report.version || '1.0.3';
  const timestamp = new Date().toISOString();
  
  const components = report.results.map(result => {
    const meta = result.metadata;
    const name = meta?.packageName || result.serverName;
    const componentVersion = meta?.version || '0.0.0';
    
    const component: any = {
      type: 'library',
      name: name,
      version: componentVersion,
      bomRef: `pkg:npm/${name}@${componentVersion}`,
      purl: `pkg:npm/${name}@${componentVersion}`,
      description: `MCP Server: ${result.serverName} (detected in ${result.toolName})`,
    };

    if (meta?.license) {
      component.licenses = [
        {
          license: {
            id: meta.license,
          }
        }
      ];
    }

    if (meta?.author) {
      component.author = meta.author;
    }

    if (meta?.repositoryUrl) {
      component.externalReferences = [
        {
          type: 'vcs',
          url: meta.repositoryUrl
        }
      ];
    }

    // Include findings as vulnerabilities in SBOM? 
    // CycloneDX supports this via 'vulnerabilities' field
    // For now, let's keep it simple with just components

    return component;
  });

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: `urn:uuid:${uuidv4()}`,
    version: 1,
    metadata: {
      timestamp: timestamp,
      tools: [
        {
          vendor: 'ThynkQ',
          name: 'mcp-scan',
          version: version
        }
      ]
    },
    components: components
  };
}
