import { ScanReport, ServerScanResult } from '../types/scan-result.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

const brand = chalk.hex('#339DFF');
const green = chalk.hex('#3FB950').bold;
const dim = chalk.dim;
const red = chalk.hex('#F85149').bold;

const UGIG_API = 'https://ugig.net/api/mcp';
const UGIG_MARKETPLACE = 'https://ugig.net/mcp';

export interface SubmitOptions {
  apiKey?: string;
  dryRun?: boolean;
  silent?: boolean;
}

export interface SubmitResult {
  submitted: number;
  skipped: number;
  failed: number;
  listings: Array<{ serverName: string; slug?: string; url?: string; error?: string }>;
}

function isCleanServer(result: ServerScanResult): boolean {
  return result.findings.filter(f =>
    f.severity === 'CRITICAL' || f.severity === 'HIGH'
  ).length === 0;
}

function buildListingPayload(result: ServerScanResult) {
  const tools: string[] = [];
  // Extract tool info from server name and findings
  return {
    title: result.serverName,
    tagline: `MCP server verified by mcp-scan`,
    description: `Security-scanned MCP server. Passed mcp-scan v1.x with no critical or high severity findings. Config detected from ${result.toolName}.`,
    price_sats: 0,
    category: 'other',
    tags: ['mcp', 'verified', 'mcp-scan', result.toolName.toLowerCase()],
    status: 'active',
    source_url: '',
    transport_type: 'stdio',
    supported_tools: tools,
    scan_report: {
      scanned_at: new Date().toISOString(),
      findings_count: result.findings.length,
      severity_breakdown: {
        critical: result.findings.filter(f => f.severity === 'CRITICAL').length,
        high: result.findings.filter(f => f.severity === 'HIGH').length,
        medium: result.findings.filter(f => f.severity === 'MEDIUM').length,
        low: result.findings.filter(f => f.severity === 'LOW').length,
        info: result.findings.filter(f => f.severity === 'INFO').length,
      }
    }
  };
}

export async function submitToUgig(
  report: ScanReport,
  options: SubmitOptions = {}
): Promise<SubmitResult> {
  const result: SubmitResult = { submitted: 0, skipped: 0, failed: 0, listings: [] };

  const cleanServers = report.results.filter(isCleanServer);
  const dirtyServers = report.results.filter(r => !isCleanServer(r));

  if (!options.silent) {
    logger.emptyLine();
    logger.log(brand('  ╭────────────────────────────────────────────╮'));
    logger.log(brand('  │') + `   🌐 Submitting verified servers to ugig.net  ` + brand('│'));
    logger.log(brand('  ╰────────────────────────────────────────────╯'));
    logger.emptyLine();

    if (dirtyServers.length > 0) {
      logger.log(chalk.yellow(`  ⚠  Skipping ${dirtyServers.length} server(s) with critical/high findings:`));
      dirtyServers.forEach(s => logger.log(dim(`     - ${s.serverName}`)));
      logger.emptyLine();
    }

    if (cleanServers.length === 0) {
      logger.log(red('  No clean servers to submit. Fix critical/high issues first.'));
      logger.emptyLine();
      return result;
    }

    logger.log(green(`  ✓ ${cleanServers.length} clean server(s) eligible for submission`));
    logger.emptyLine();
  }

  if (!options.apiKey) {
    if (!options.silent) {
      logger.log(chalk.yellow('  API key required. Set it via:'));
      logger.log(dim('    export UGIG_API_KEY=ugig_live_...'));
      logger.log(dim('    mcp-scan --submit --ugig-key ugig_live_...'));
      logger.emptyLine();
      logger.log(`  Get your API key at: ${brand('https://ugig.net/settings/api-keys')}`);
      logger.emptyLine();
    }
    result.skipped = cleanServers.length;
    return result;
  }

  for (const server of cleanServers) {
    const payload = buildListingPayload(server);

    if (options.dryRun) {
      if (!options.silent) {
        logger.log(`  ${dim('[dry-run]')} Would submit: ${chalk.white.bold(server.serverName)}`);
        logger.log(dim('  ' + JSON.stringify(payload, null, 2).split('\n').join('\n  ')));
      }
      result.submitted++;
      result.listings.push({ serverName: server.serverName });
      continue;
    }

    try {
      const response = await fetch(UGIG_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': options.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json() as { slug?: string };
        const listingUrl = data.slug ? `${UGIG_MARKETPLACE}/${data.slug}` : UGIG_MARKETPLACE;
        result.submitted++;
        result.listings.push({ serverName: server.serverName, slug: data.slug, url: listingUrl });
        if (!options.silent) {
          logger.log(green(`  ✓ Submitted: ${server.serverName}`));
          logger.log(dim(`    → ${listingUrl}`));
        }
      } else {
        const errText = await response.text();
        result.failed++;
        result.listings.push({ serverName: server.serverName, error: `HTTP ${response.status}: ${errText.substring(0, 100)}` });
        if (!options.silent) {
          logger.log(red(`  ✗ Failed: ${server.serverName} — HTTP ${response.status}`));
        }
      }
    } catch (err) {
      result.failed++;
      const errMsg = err instanceof Error ? err.message : String(err);
      result.listings.push({ serverName: server.serverName, error: errMsg });
      if (!options.silent) {
        logger.log(red(`  ✗ Failed: ${server.serverName} — ${errMsg}`));
      }
    }
  }

  if (!options.silent) {
    logger.emptyLine();
    if (result.submitted > 0) {
      logger.log(green(`  ✓ ${result.submitted} server(s) submitted to ugig.net/mcp`));
    }
    if (result.failed > 0) {
      logger.log(red(`  ✗ ${result.failed} submission(s) failed`));
    }
    if (result.skipped > 0) {
      logger.log(dim(`  ⊘ ${result.skipped} server(s) skipped (missing API key or unclean)`));
    }
    logger.log(dim(`\n  View your listings: ${UGIG_MARKETPLACE}`));
    logger.emptyLine();
  }

  return result;
}
