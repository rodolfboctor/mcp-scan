<div align="center">

  <h1>🛡️ mcp-scan</h1>

  <p><strong>Security scanner for your MCP server configs.</strong></p>
  <p>Find leaked secrets, typosquatting, and misconfigurations before they become incidents.</p>

  <p>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/v/mcp-scan?style=flat-square&color=339DFF" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/dm/mcp-scan?style=flat-square&color=339DFF" alt="downloads"></a>
    <a href="https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/mcp-scan?style=flat-square" alt="license"></a>
    <a href="https://github.com/rodolfboctor/mcp-scan/stargazers"><img src="https://img.shields.io/github/stars/rodolfboctor/mcp-scan?style=flat-square&color=339DFF" alt="stars"></a>
  </p>

</div>

<br/>

## Installation

```bash
# For global installation
npm install -g mcp-scan

# Or run directly
npx mcp-scan
```

## Programmatic Usage

`mcp-scan` can be used as a library in your Node.js projects (ESM and CJS supported).

```javascript
import { runScan } from 'mcp-scan';

const report = await runScan({
  silent: true,
  severity: 'high'
});

console.log(`Scan complete. Found ${report.criticalCount} critical issues.`);
```

## Supported clients

| Client | Config path (macOS) | Format |
|:-------|:-------------------|:-------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | JSON |
| Cursor | `~/.cursor/mcp.json` | JSON |
| VS Code | `~/.vscode/mcp.json` | JSON |
| Claude Code | `~/.claude.json` | JSON |
| Gemini CLI | `~/.gemini/settings.json` | JSON |
| Codex CLI | `~/.codex/config.toml` | TOML |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | JSON |
| Zed | `~/.config/zed/settings.json` | JSON |
| Continue.dev | `~/.continue/config.json` | JSON |
| Cline / Roo Code | VS Code extension settings | JSON |
| Amp | `~/.amp/config.json` | JSON |
| Plandex | `~/.plandex/config.json` | JSON |
| GitHub Copilot | `~/.config/github-copilot/apps.json` | JSON |
| Project-level | `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json` | JSON |

> Windows and Linux paths are auto-detected.

## How it works

```
  Config files       ──►  12 parallel scanners  ──►  Findings report
  (auto-detected)         secrets, typosquat,         with severity,
                          malicious, perms,           fix guidance,
                          AST, transport,             and exit codes
                          prompt injection,
                          env leak, CVEs,
                          tool poisoning,
                          license compliance
```

1. **Discovers** MCP configs across all supported clients
2. **Parses** JSON and TOML formats, extracts server entries
3. **Runs** 12 scanners in parallel against each server entry
4. **Reports** findings sorted by severity with actionable recommendations

## CLI Reference

```bash
mcp-scan                                # Default scan
mcp-scan --severity high                # Only show high/critical
mcp-scan --html report.html             # Generate self-contained HTML report
mcp-scan --sbom sbom.json               # Generate CycloneDX v1.5 SBOM
mcp-scan --json                         # JSON output for pipelines
mcp-scan --sarif results.sarif          # SARIF output for GitHub Security
mcp-scan --offline                      # Offline mode (skip network calls)
mcp-scan audit                          # View scan history and trends
mcp-scan audit <server>                 # Deep audit of a specific package
mcp-scan report --configs dir/          # Aggregate all configs in a directory
mcp-scan diff old.json new.json         # Compare two scan reports
mcp-scan fix                            # Interactive auto-fix with confidence scoring
mcp-scan watch                          # Continuous monitoring with live dashboard
mcp-scan doctor                         # Run system diagnostic check
mcp-scan init                           # Create security policy (.mcp-scan.json)
```

## CI/CD

### GitHub Actions (native action)

```yaml
name: MCP Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: rodolfboctor/mcp-scan@main
        with:
          severity: 'high'
          sarif-output: 'mcp-scan-results.sarif'
```

## Badge

Show your users their MCP configs are audited:

```markdown
[![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-339DFF?style=flat-square)](https://github.com/rodolfboctor/mcp-scan)
```

[![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-339DFF?style=flat-square)](https://github.com/rodolfboctor/mcp-scan)

## Integrations

| Project | Type | Link |
|:--------|:-----|:-----|
| **ugig.net** | MCP marketplace — browse and list verified servers | [ugig.net/mcp](https://ugig.net/mcp) |

> Using mcp-scan? [Open an issue](https://github.com/rodolfboctor/mcp-scan/issues) and we'll add you here.

## Contributing

PRs and issues welcome. If you find a malicious MCP package in the wild, report it and we'll add it to the blocklist same day.

## License

[MIT](https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE)

---

<div align="center">
  <sub>
    Built by <strong>Rodolf</strong> &nbsp;·&nbsp;
    <a href="https://thynkq.com" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;">
      <span style="font-family:'Urbanist',system-ui,sans-serif;font-weight:400;letter-spacing:-0.03em">thynk</span><svg height="13" width="13" viewBox="0 0 28 36" fill="none" style="vertical-align:middle"><circle cx="13" cy="18" r="10" stroke="#339DFF" stroke-width="3.5" fill="none" stroke-linecap="round"/><line x1="18.5" y1="23.5" x2="25" y2="30" stroke="#339DFF" stroke-width="3.5" stroke-linecap="round"/></svg>
    </a>
  </sub>
</div>
