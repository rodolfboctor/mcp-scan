import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

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
    if (!res.ok) return findings;

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
  } catch {
    // Ignore network errors during deep audit
  }

  return findings;
}
