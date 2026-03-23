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

## Demo

Here's what a scan looks like when it finds some common issues:

```bash
$ mcp-scan

╔════════════════════════════════════════════╗
║              mcp-scan results              ║
╚════════════════════════════════════════════╝

Cursor - postmark-mcp
Config: /Users/rodolf/.cursor/mcp.json
┌────────────┬─────────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ Severity   │ ID                      │ Description                                 │ Recommendation                              │
├────────────┼─────────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ CRITICAL   │ known-malicious         │ Package 'postmark-mcp' is on the known mal… │ Remove this server immediately.             │
└────────────┴─────────────────────────┴─────────────────────────────────────────────┴─────────────────────────────────────────────┘

VS Code - github-leaky
Config: /Users/rodolf/.vscode/mcp.json
┌────────────┬─────────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ Severity   │ ID                      │ Description                                 │ Recommendation                              │
├────────────┼─────────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ CRITICAL   │ exposed-secret          │ Exposed GitHub Token in environment variab… │ Move the secret to a secure environment va… │
└────────────┴─────────────────────────┴─────────────────────────────────────────────┴─────────────────────────────────────────────┘

──────────────────────────────────────────────────
✖ CRITICAL: 2 servers scanned in 12ms. Critical: 2, High: 0, Medium: 0.
```

## What it scans

| Scanner | What it catches | Example |
|:--------|:----------------|:--------|
| **Secrets** | 30+ API key formats in env vars and args | `OPENAI_KEY=sk-proj-...` |
| **Typosquatting** | Homoglyphs, swaps, missing hyphens | `@modeicontextprotocol` |
| **Malicious packages** | Confirmed malware and exfiltration tools | `postmark-mcp` |
| **Permissions** | Overly broad filesystem access | `/` instead of `~/projects` |
| **AST analysis** | Reverse shells, exfil pipes, eval() | `cat secrets \| curl ...` |
| **Transport** | Unencrypted HTTP for remote servers | `http://example.com` |

## Supported clients

| Client | Config path | Format |
|:-------|:-----------|:-------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | JSON |
| Cursor | `~/.cursor/mcp.json` | JSON |
| VS Code Copilot | `~/.vscode/mcp.json` | JSON |
| Claude Code | `~/.claude.json` | JSON |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | JSON |
| Gemini CLI | `~/.gemini/settings.json` | JSON |
| Codex CLI | `~/.codex/config.toml` | TOML |

> Paths shown for macOS. Windows and Linux equivalents are auto-detected.

## How it works

```
  Config files       ──►  6 parallel scanners  ──►  Findings report
  (auto-detected)         secrets, typosquat,        with severity,
                          malicious, perms,          fix guidance,
                          AST, transport             and exit codes
```

1. **Discovers** MCP configs across all supported clients
2. **Parses** JSON and TOML formats, extracts server entries
3. **Runs** 6 scanners in parallel against each server entry
4. **Reports** findings sorted by severity with actionable recommendations

## CI/CD

Add to any GitHub Actions workflow:

```yaml
name: MCP Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx mcp-scan ci
```

Exits with code 1 if critical findings are detected. Pair with `--json` for programmatic parsing.

## CLI reference

```bash
mcp-scan                        # Scan all detected configs
mcp-scan --config path/to/file  # Scan a specific config
mcp-scan --json                 # JSON output for pipelines
mcp-scan ci                     # CI mode (strict exit codes)
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
| **ugig.net** | MCP marketplace | [ugig.net/mcp](http://ugig.net/mcp) |

> Using mcp-scan? [Open an issue](https://github.com/rodolfboctor/mcp-scan/issues) and we'll add you here.

## Contributing

PRs and issues welcome. If you find a malicious MCP package in the wild, report it and we'll add it to the blocklist same day.

## License

[MIT](https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE)

---

<div align="center">
  <sub>Built by <a href="https://thynkq.com">ThynkQ</a></sub>
</div>
