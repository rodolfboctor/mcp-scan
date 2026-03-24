<div align="center">

# mcp-scan

Security scanner for MCP server configurations

[![npm version](https://img.shields.io/npm/v/mcp-scan?color=blue)](https://www.npmjs.com/package/mcp-scan)
[![npm downloads](https://img.shields.io/npm/dm/mcp-scan)](https://www.npmjs.com/package/mcp-scan)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

**One command. Full MCP security audit.**

</div>

---

## Quick start

```bash
npx mcp-scan
```

```
$ npx mcp-scan

  ┌ Claude Desktop › filesystem
  │ /Users/alice/Library/Application Support/Claude/claude_desktop_config.json
  │
  │   HIGH       exposed-secret
  │            Environment variable GITHUB_TOKEN contains a hardcoded secret.
  │            Move the value to a .env file and reference it as ${GITHUB_TOKEN}
  │
  └──────────────────────────────────────────────

  ✓ Claude Desktop › github         0 issues
  ✓ Claude Desktop › slack          0 issues

  ──────────────────────────────────────────
   Scanned 3 servers across 1 client in 42ms
    0 critical    1 high    2 medium    0 low
  ──────────────────────────────────────────
```

## Why this exists

MCP servers run with access to your filesystem, shell, and network. Most users add them from README instructions without auditing what they contain. mcp-scan scans every configured server automatically and flags what's dangerous.

---

## Supported clients

| Client | Config path (macOS) | Format |
|:-------|:--------------------|:-------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | JSON |
| Cursor | `~/.cursor/mcp.json` | JSON |
| VS Code | `~/.vscode/mcp.json` | JSON |
| Claude Code | `~/.claude.json` | JSON |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | JSON |
| Gemini CLI | `~/.gemini/settings.json` | JSON |
| Codex CLI | `~/.codex/config.toml` | TOML |
| Zed | `~/.config/zed/settings.json` | JSON |
| Continue.dev | `~/.continue/config.json` | JSON |
| Cline | VS Code extension settings | JSON |
| Roo Code | VS Code extension settings | JSON |
| Amp | `~/.amp/config.json` | JSON |
| Plandex | `~/.plandex/config.json` | JSON |
| GitHub Copilot | `~/.config/github-copilot/apps.json` | JSON |
| ChatGPT Desktop | `~/Library/Application Support/com.openai.chat/settings.json` | JSON |

Windows and Linux paths are auto-detected. Project-level configs (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`) are also scanned.

---

## Scanners

| Scanner | What it detects |
|:--------|:----------------|
| **secret** | Hardcoded API keys, tokens, and passwords in env vars and args. Uses regex patterns and Shannon entropy analysis. |
| **registry** | Packages on the known malicious blocklist. Checks against a curated list of confirmed malicious packages. |
| **typosquat** | Package names that closely resemble known official servers. Catches homoglyph substitutions and Levenshtein distance attacks. |
| **permission** | Overly broad filesystem paths (`/`, `~`, `/Users`, `~/.ssh`, `~/.aws`). |
| **transport** | HTTP connections without authentication, deprecated SSE transport. |
| **ast** | Suspicious execution patterns (`bash -c`, `eval`, `exec`) and data exfiltration via piped `curl`/`wget`. Cross-origin exfiltration analysis included. |
| **prompt-injection** | Malicious instructions embedded in server descriptions or args. Catches known jailbreak phrases, unicode tricks, and base64-encoded payloads. |
| **tool-poisoning** | Capability injection attacks: hidden instructions via whitespace padding, exfiltration keywords, and cross-tool manipulation patterns. |
| **env-leak** | Secret keys in `.env` files within server directories that are exposed to the server process. |
| **package** | Known CVEs via OSV.dev API (online) or bundled snapshot (offline). Parses CVSS vectors for severity scoring. |
| **supply-chain** | Supply chain trust scoring: GitHub stars, fork count, contributor count, last push date, npm metadata. |
| **license** | License compliance: flags GPL/AGPL/LGPL copyleft and packages with no license specified. |
| **config** | Shell injection patterns in argument strings. Flags `${}`, `$()`, and backtick usage in args. |

---

## Severity levels

| Level | Meaning |
|:------|:--------|
| CRITICAL | Immediate risk. Stop using this server until fixed. |
| HIGH | Serious issue. Fix before next session. |
| MEDIUM | Risk exists but context-dependent. Review and decide. |
| LOW | Minor concern or informational. |
| INFO | No risk. Logged for awareness. |

---

<details>
<summary>Full CLI reference</summary>

### Commands

| Command | Description |
|:--------|:------------|
| `mcp-scan` | Default scan of all detected AI tool configs |
| `mcp-scan scan` | Explicit scan command with all flags |
| `mcp-scan audit [server]` | View scan history or deep audit a specific server |
| `mcp-scan fix` | Interactive auto-fix for secrets and permission issues |
| `mcp-scan watch` | Continuous monitoring of config files |
| `mcp-scan diff <old> <new>` | Compare two scan reports and show changes |
| `mcp-scan history` | Show scan history trends and common findings |
| `mcp-scan doctor` | Run system diagnostic check |
| `mcp-scan report` | Scan all config files in a directory, produce unified report |
| `mcp-scan ls` | List all detected MCP servers |
| `mcp-scan init` | Create `.mcp-scan.json` policy config in current directory |
| `mcp-scan scanners` | List all available security scanners |
| `mcp-scan ci` | CI mode with JSON output and strict exit codes |
| `mcp-scan submit` | Scan and submit clean servers to ugig.net marketplace |
| `mcp-scan dashboard` | Launch the interactive TUI dashboard |
| `mcp-scan proxy` | Run a local proxy that intercepts MCP server traffic |

### Scan flags

| Flag | Description |
|:-----|:------------|
| `--json` | Output report in JSON format |
| `--sarif <path>` | Output SARIF report for GitHub Security Scanning |
| `--html <path>` | Output self-contained HTML report |
| `--sbom <path>` | Output CycloneDX v1.5 SBOM |
| `--severity <level>` | Filter by minimum severity: `low`, `medium`, `high`, `critical` (default: `low`) |
| `--offline` | Skip all network calls, use bundled CVE snapshot |
| `--config <path>` | Scan a specific config file instead of auto-detecting |
| `--fix` | Automatically apply fixes where possible |
| `--submit` | Submit clean servers to ugig.net MCP marketplace after scan |
| `--ugig-key <key>` | ugig.net API key (or set `UGIG_API_KEY` env var) |
| `--dry-run` | Preview what would be submitted without sending |
| `--webhook <url>` | POST scan results to a webhook URL |
| `--slack-webhook <url>` | POST scan results to a Slack webhook URL |
| `--ci` | CI mode: JSON output, exit code 1 on high/critical findings |
| `-v, --verbose` | Enable verbose output |

### Watch flags

| Flag | Description |
|:-----|:------------|
| `--webhook <url>` | POST new findings to a webhook (fires only on new findings) |
| `--slack-webhook <url>` | POST new findings to Slack (fires only on new findings) |

### CI command flags

| Flag | Description |
|:-----|:------------|
| `--max-severity <level>` | Maximum allowed severity before failing (default: `high`) |
| `--output <path>` | Path to save JSON output |

</details>

---

## Output formats

**CLI table** (default) -- color-coded findings grouped by client and server.

**`--json`** -- machine-readable JSON. Pipe to `jq` or save for programmatic use.

```bash
mcp-scan --json > report.json
```

**`--sarif <path>`** -- SARIF 2.1.0 format for GitHub Advanced Security tab.

```bash
mcp-scan --sarif results.sarif
```

**`--html <path>`** -- self-contained HTML report with no external dependencies.

```bash
mcp-scan --html report.html
```

**`--sbom <path>`** -- CycloneDX v1.5 Software Bill of Materials.

```bash
mcp-scan --sbom sbom.json
```

---

## CI/CD integration

### GitHub Actions

```yaml
name: MCP Security Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: rodolfboctor/mcp-scan@v1
        id: mcp-scan
        with:
          severity: high
          sarif-output: results.sarif

      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

**Action inputs:**

| Input | Default | Description |
|:------|:--------|:------------|
| `config` | `` | Path to specific MCP config file |
| `severity` | `high` | Minimum severity threshold |
| `fail-on-findings` | `true` | Exit 1 if findings exist at or above threshold |
| `sarif-output` | `mcp-scan-results.sarif` | Path for SARIF report output |

**Action outputs:**

| Output | Description |
|:-------|:------------|
| `findings-count` | Total findings |
| `critical-count` | Critical findings |
| `high-count` | High severity findings |
| `medium-count` | Medium severity findings |
| `low-count` | Low severity findings |
| `info-count` | Info findings |
| `sarif-path` | Path to the SARIF file |

### Direct CI usage

```bash
mcp-scan ci --max-severity high --output results.json
```

Exits with code 1 if any findings meet or exceed the threshold.

---

## Library usage

mcp-scan is published as an ESM and CJS npm library.

```typescript
import { runScan, detectTools } from 'mcp-scan';
import type { ScanReport, ServerScanResult, Finding, ScanOptions } from 'mcp-scan';

const report: ScanReport = await runScan({
  silent: true,
  severity: 'high',
  offline: false,
});

console.log(`${report.criticalCount} critical findings`);
```

**Exported API:**

| Export | Type | Description |
|:-------|:-----|:------------|
| `runScan(options)` | Function | Run a full scan and return a `ScanReport` |
| `detectTools(deps)` | Function | Detect configured AI tool clients |
| `ScanReport` | Type | Full scan report with counts and results |
| `ServerScanResult` | Type | Per-server scan result with findings |
| `Finding` | Type | Individual finding with id, severity, description |
| `ScanOptions` | Interface | Options for `runScan`: `severity`, `silent`, `json`, `verbose`, `fix`, `config`, `offline`, `ci` |

---

## Integrations

**ugig.net marketplace** -- scan and submit clean servers for public verification:

```bash
mcp-scan submit --ugig-key YOUR_KEY
# or
UGIG_API_KEY=YOUR_KEY mcp-scan --submit
```

**GitHub Security tab** -- upload SARIF output:

```bash
mcp-scan --sarif results.sarif
# then upload via gh CLI or the GitHub Action above
```

**Slack** -- post findings to a channel:

```bash
mcp-scan --slack-webhook https://hooks.slack.com/services/...
```

**Custom webhooks** -- POST JSON report to any endpoint:

```bash
mcp-scan --webhook https://your-endpoint.example.com/mcp-findings
```

**Watch mode** -- fire webhook only when new findings appear:

```bash
mcp-scan watch --webhook https://your-endpoint.example.com/mcp-findings
```

**Policy file** -- suppress known false positives and set rules:

```bash
mcp-scan init   # creates .mcp-scan.json
```

---

<details>
<summary>Architecture</summary>

```
Config Detection  -->  Config Parsing  -->  Server Extraction  -->  Scanner Pipeline  -->  Report Generation
```

**Config Detection:** 15 tool clients auto-detected by platform (macOS/Windows/Linux). Extension glob matching for Cline and Roo Code. Project-level configs picked up from cwd.

**Config Parsing:** JSON, JSONC, and TOML formats. Extracts named server entries with command, args, and env blocks.

**Scanner Pipeline:** 13 scanners run against each `ResolvedServer` object. Most run synchronously in parallel; `package` and `supply-chain` are async (OSV.dev and npm registry calls skipped in offline mode).

**Report Generation:** Findings sorted by severity. Counts aggregated per server, per client, and globally. Output adapters for CLI table, JSON, SARIF, HTML, and CycloneDX SBOM.

</details>

---

## Badge

Add this to your project README to show MCP configs are audited:

```markdown
[![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-339DFF?style=flat-square)](https://github.com/rodolfboctor/mcp-scan)
```

[![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-339DFF?style=flat-square)](https://github.com/rodolfboctor/mcp-scan)

---

## License

[MIT](LICENSE)

---

<div align="center">
  <sub>
    Built by <strong>Rodolf</strong> &nbsp;·&nbsp;
    <a href="https://thynkq.com" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;">
      <span style="font-family:'Urbanist',system-ui,sans-serif;font-weight:400;letter-spacing:-0.03em">thynk</span><svg height="13" width="13" viewBox="0 0 28 36" fill="none" style="vertical-align:middle"><circle cx="13" cy="18" r="10" stroke="#339DFF" stroke-width="3.5" fill="none" stroke-linecap="round"/><line x1="18.5" y1="23.5" x2="25" y2="30" stroke="#339DFF" stroke-width="3.5" stroke-linecap="round"/></svg>
    </a>
  </sub>
</div>
