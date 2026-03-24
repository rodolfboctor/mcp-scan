import { ResolvedServer } from '../types/config.js';
import { Finding, FindingId } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';
import { parseCvssVector } from 'vuln-vects';

// This is a stub for package scanning (network calls) used during deep audits
export async function scanPackageDeep(server: ResolvedServer): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  let packageName = '';
  if (server.command === 'npx' || server.command === 'npm') {
    const pkgArg = server.args?.find(a => !a.startsWith('-'));
    if (pkgArg) packageName = pkgArg;
  }

  if (!packageName) return findings;

  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);
    if (!res.ok) {
      logger.warn(`Failed to fetch package info for ${packageName} from npm registry.`);
      // Continue to OSV.dev even if npm registry fetch fails
    } else {
      const data = await res.json() as any;
      if (data && typeof data === 'object' && data.time && typeof data.time.modified === 'string') {
        const lastModified = new Date(data.time.modified);
        const now = new Date();
        const diffMonths = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (diffMonths > 6) {
          findings.push({
            id: 'stale-server',
            severity: 'HIGH',
            description: `npm package '${packageName}' has not been updated in over 6 months.`,
          });
        }
      }
    }
  } catch (error) {
    logger.warn(`Network error fetching npm registry for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
    // Continue to OSV.dev even if npm registry fetch fails
  }

  // OSV.dev integration
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const osvRes = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package: {
          name: packageName,
          ecosystem: 'npm',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!osvRes.ok) {
      logger.warn(`OSV.dev API request failed for ${packageName}: ${osvRes.statusText}`);
      return findings;
    }

    const osvData = await osvRes.json() as any;

    if (osvData && osvData.vulns && Array.isArray(osvData.vulns)) {
      for (const vuln of osvData.vulns) {
        let cvssScore = 0;
        if (vuln.severity && Array.isArray(vuln.severity)) {
          for (const severity of vuln.severity) {
            if (severity.type === 'CVSS_V3' && severity.score) {
              try {
                const parsedScore = parseCvssVector(severity.score);
                if (parsedScore && typeof parsedScore.baseScore === 'number') {
                  cvssScore = parsedScore.baseScore;
                  break; // Found a valid CVSS_V3 score, no need to check further
                }
              } catch (error) {
                logger.warn(`Failed to parse CVSS score '${severity.score}': ${error instanceof Error ? error.message : String(error)}`);
                // Continue to next severity or default cvssScore to 0
              }
            }
          }
        }
        
        if (cvssScore >= 9.0) {
          findings.push({
            id: 'known-vulnerability-critical' as FindingId,
            severity: 'CRITICAL',
            description: `Critical vulnerability found in '${packageName}': ${vuln.id} - ${vuln.summary || vuln.details}`,
            fixRecommendation: `Review OSV.dev advisory: ${vuln.id} (${vuln.details}). Upgrade package or remove it.`,
            fixable: true,
          });
        } else if (cvssScore >= 7.0) {
          findings.push({
            id: 'known-vulnerability-high' as FindingId,
            severity: 'HIGH',
            description: `High vulnerability found in '${packageName}': ${vuln.id} - ${vuln.summary || vuln.details}`,
            fixRecommendation: `Review OSV.dev advisory: ${vuln.id} (${vuln.details}). Upgrade package or remove it.`,
            fixable: true,
          });
        }
      }
    }

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn(`OSV.dev API request for ${packageName} timed out after 5 seconds.`);
    } else {
      logger.warn(`Error querying OSV.dev for ${packageName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return findings;
}
