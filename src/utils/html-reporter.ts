import { ScanReport } from '../types/scan-result.js';

/**
 * Generates a self-contained HTML security report.
 * @param report The scan report to generate the HTML for.
 * @returns The HTML report as a string.
 */
export function generateHtmlReport(report: ScanReport): string {
  const brandBlue = '#339DFF';
  const criticalColor = '#F85149';
  const highColor = '#F0883E';
  const mediumColor = '#D29922';
  const lowColor = '#8B949E';
  const passColor = '#3FB950';

  const version = report.version || '1.0.3';
  const timestamp = new Date().toLocaleString();

  const totalFindings = report.criticalCount + report.highCount + report.mediumCount + report.lowCount + report.infoCount;
  const isAllClear = totalFindings === 0;

  const resultsHtml = report.results.length === 0 
    ? `<div class="empty-state">No MCP servers detected to scan.</div>`
    : report.results.map(result => {
        const findingsHtml = result.findings.length === 0
          ? `<div class="server-clean">✓ No issues found</div>`
          : result.findings.map(finding => `
            <div class="finding severity-${finding.severity.toLowerCase()}">
              <div class="finding-header">
                <span class="badge badge-${finding.severity.toLowerCase()}">${finding.severity}</span>
                <span class="finding-id">${finding.id}</span>
              </div>
              <div class="finding-description">${finding.description}</div>
              ${finding.fixRecommendation ? `<div class="finding-fix">↳ ${finding.fixRecommendation}</div>` : ''}
            </div>
          `).join('');

        return `
          <div class="server-card">
            <div class="server-header">
              <div class="server-name">${result.toolName} › ${result.serverName}</div>
              <div class="server-path">${result.configPath}</div>
            </div>
            <div class="server-findings">
              ${findingsHtml}
            </div>
          </div>
        `;
      }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mcp-scan Security Report</title>
    <style>
        :root {
            --bg: #0d1117;
            --card-bg: #161b22;
            --text: #c9d1d9;
            --text-dim: #8b949e;
            --border: #30363d;
            --brand: ${brandBlue};
            --critical: ${criticalColor};
            --high: ${highColor};
            --medium: ${mediumColor};
            --low: ${lowColor};
            --pass: ${passColor};
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.5;
            margin: 0;
            padding: 2rem;
            display: flex;
            justify-content: center;
        }

        .container {
            max-width: 900px;
            width: 100%;
        }

        header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .title-group h1 {
            margin: 0;
            color: var(--brand);
            font-size: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .title-group p {
            margin: 0.5rem 0 0;
            color: var(--text-dim);
        }

        .meta {
            text-align: right;
            font-size: 0.85rem;
            color: var(--text-dim);
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .summary-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
        }

        .summary-card .value {
            font-size: 1.5rem;
            font-weight: bold;
            display: block;
        }

        .summary-card .label {
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--text-dim);
            letter-spacing: 0.05em;
        }

        .summary-card.critical .value { color: var(--critical); }
        .summary-card.high .value { color: var(--high); }
        .summary-card.medium .value { color: var(--medium); }
        .summary-card.low .value { color: var(--low); }
        .summary-card.info .value { color: var(--brand); }

        .server-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }

        .server-header {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--border);
        }

        .server-name {
            font-weight: bold;
            font-size: 1.1rem;
        }

        .server-path {
            font-family: monospace;
            font-size: 0.8rem;
            color: var(--text-dim);
            margin-top: 0.25rem;
        }

        .server-findings {
            padding: 0;
        }

        .finding {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .finding:last-child {
            border-bottom: none;
        }

        .finding-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
        }

        .badge {
            font-size: 0.7rem;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            text-transform: uppercase;
        }

        .badge-critical { background: var(--critical); color: white; }
        .badge-high { background: var(--high); color: white; }
        .badge-medium { background: var(--medium); color: white; }
        .badge-low { background: #30363d; color: var(--text); }
        .badge-info { background: var(--brand); color: white; }

        .finding-id {
            font-weight: bold;
            font-family: monospace;
        }

        .finding-description {
            font-size: 0.95rem;
        }

        .finding-fix {
            font-size: 0.85rem;
            color: var(--text-dim);
            margin-top: 0.5rem;
            padding-left: 1rem;
        }

        .server-clean {
            padding: 1.5rem;
            text-align: center;
            color: var(--pass);
            font-weight: bold;
        }

        .empty-state {
            padding: 3rem;
            text-align: center;
            color: var(--text-dim);
            background: var(--card-bg);
            border: 1px dashed var(--border);
            border-radius: 8px;
        }

        footer {
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--text-dim);
            font-size: 0.85rem;
        }

        footer a {
            color: var(--brand);
            text-decoration: none;
        }

        .status-banner {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: bold;
        }

        .status-banner.clear {
            background: rgba(63, 185, 80, 0.1);
            border: 1px solid var(--pass);
            color: var(--pass);
        }

        .status-banner.vulnerable {
            background: rgba(248, 81, 73, 0.1);
            border: 1px solid var(--critical);
            color: var(--critical);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1>🛡️ mcp-scan</h1>
                <p>Security scanner for MCP server configs</p>
            </div>
            <div class="meta">
                <div>v${version}</div>
                <div>${timestamp}</div>
            </div>
        </header>

        ${isAllClear 
          ? `<div class="status-banner clear">✓ All Clear — No security issues found</div>`
          : `<div class="status-banner vulnerable">⚠ ${totalFindings} findings detected</div>`
        }

        <div class="summary-grid">
            <div class="summary-card critical">
                <span class="value">${report.criticalCount}</span>
                <span class="label">Critical</span>
            </div>
            <div class="summary-card high">
                <span class="value">${report.highCount}</span>
                <span class="label">High</span>
            </div>
            <div class="summary-card medium">
                <span class="value">${report.mediumCount}</span>
                <span class="label">Medium</span>
            </div>
            <div class="summary-card low">
                <span class="value">${report.lowCount}</span>
                <span class="label">Low</span>
            </div>
            <div class="summary-card">
                <span class="value">${report.totalScanned}</span>
                <span class="label">Servers</span>
            </div>
        </div>

        <main>
            ${resultsHtml}
        </main>

        <footer>
            by <strong>Rodolf</strong> · thynk<strong>Q</strong> · <a href="https://thynkq.com" target="_blank">thynkq.com</a>
        </footer>
    </div>
</body>
</html>
  `;
}
