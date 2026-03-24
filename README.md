<div align="center">

# mcp-scan

Security scanner for MCP server configurations.

<img src="https://img.shields.io/npm/v/mcp-scan" alt="npm version" />
<img src="https://img.shields.io/npm/dm/mcp-scan" alt="npm downloads" />
<img src="https://img.shields.io/npm/l/mcp-scan" alt="license" />
<img src="https://img.shields.io/node/v/mcp-scan" alt="node version" />
<img src="https://img.shields.io/github/stars/rodolfboctor/mcp-scan" alt="github stars" />

<!-- TODO: replace with asciinema SVG recording -->

</div>

### Why this exists
MCP servers run with full filesystem and network access. Most users install them without auditing what they are actually running. mcp-scan scans your configurations automatically and surfaces what needs attention.

### Quick start
```bash
npx mcp-scan
```

```text
$ npx mcp-scan

  ┌ Claude Desktop › filesystem
  │ /Users/rodolf/Library/Application Support/Claude/claude_desktop_config.json
  │
  │   HIGH       exposed-secret
  │            Environment variable GITHUB_TOKEN contains a hardcoded secret.
  │            Move the value to a .env file and reference it as ${GITHUB_TOKEN}.
  │
  └────────────────────────────────────────────────

  ✓ Claude Desktop › github         0 issues
  ✓ Claude Desktop › slack          0 issues

  ────────────────────────────────────────────────
   Scanned 3 servers across 1 client in 45ms
    0 critical    1 high    0 medium    0 low
  ────────────────────────────────────────────────
```

### What gets scanned
| Client | Config location | Platform |
|:-------|:----------------|:---------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | macOS |
| Cursor | `~/.cursor/mcp.json` | macOS, Linux |
| VS Code | `~/.vscode/mcp.json` | macOS, Linux |
| Claude Code | `~/.claude.json` | macOS, Linux |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | macOS, Linux |
| Gemini CLI | `~/.gemini/settings.json` | macOS, Linux |
| Codex CLI | `~/.codex/config.toml` | macOS, Linux |
| Zed | `~/.config/zed/settings.json` | macOS, Linux |
| Continue.dev | `~/.continue/config.json` | macOS, Linux |
| Cline | VS Code extension settings | macOS, Linux |
| Roo Code | VS Code extension settings | macOS, Linux |
| Amp | `~/.amp/config.json` | macOS, Linux |
| Plandex | `~/.plandex/config.json` | macOS, Linux |
| GitHub Copilot | `~/.config/github-copilot/apps.json` | macOS, Linux |
| ChatGPT Desktop | `~/Library/Application Support/com.openai.chat/settings.json` | macOS |

Windows paths are automatically detected using `%APPDATA%` and `%USERPROFILE%`.

### Scanners
| Scanner | What it detects | Severity range |
|:--------|:----------------|:---------------|
| **secret** | Hardcoded API keys and tokens in env vars or args | HIGH — CRITICAL |
| **registry** | Packages on the known malicious blocklist | CRITICAL |
| **typosquat** | Package names that closely resemble official servers | HIGH |
| **permission** | Overly broad filesystem paths like `/`, `~`, or `.ssh` | MEDIUM — HIGH |
| **transport** | HTTP without auth or deprecated SSE transport | LOW — MEDIUM |
| **ast** | Suspicious execution patterns like `eval` or `exec` | HIGH — CRITICAL |
| **prompt-injection** | Malicious instructions in server descriptions | MEDIUM — HIGH |
| **tool-poisoning** | Capability injection and cross-tool manipulation | HIGH |
| **env-leak** | Secrets in `.env` files exposed to server process | HIGH |
| **package** | Known CVEs via OSV.dev API or bundled snapshot | MEDIUM — CRITICAL |
| **supply-chain** | Low trust scores based on npm and GitHub metadata | LOW — MEDIUM |
| **license** | Copyleft licenses or missing license fields | LOW |
| **config** | Shell injection patterns in argument strings | HIGH |

### Severity levels
| Level | Meaning |
|:------|:--------|
| **CRITICAL** | Immediate risk. Stop using until resolved. |
| **HIGH** | Significant risk. Fix before next session. |
| **MEDIUM** | Risk present. Fix in current sprint. |
| **LOW** | Minor issue. Fix when convenient. |
| **INFO** | Informational. No action required. |

### CLI reference
<details>
<summary>Click to view all commands and flags</summary>

#### Commands
| Command | Description |
|:--------|:------------|
| `scan` | Default scan of all detected AI tool configs |
| `audit` | View scan history or deep audit a specific server |
| `fix` | Interactive auto-fix for secrets and permissions |
| `watch` | Continuous monitoring of config files |
| `ls` | List all detected MCP servers |
| `diff` | Compare two scan reports and show changes |
| `submit` | Scan and submit clean servers to ugig.net marketplace |
| `ci` | CI mode with JSON output and strict exit codes |
| `dashboard` | Launch the interactive TUI dashboard |
| `history` | Show scan history trends and statistics |
| `doctor` | Run system diagnostic check |
| `report` | Scan all configs in a directory for a unified report |
| `init` | Create `.mcp-scan.json` policy config |
| `proxy` | Run local proxy to intercept MCP server traffic |

#### Flags
| Flag | What it does | Default |
|:-----|:-------------|:--------|
| `--json` | Output report in JSON format | `false` |
| `--sarif <path>` | Output SARIF report for GitHub Security | `undefined` |
| `--html <path>` | Output self-contained HTML report | `undefined` |
| `--sbom <path>` | Output CycloneDX SBOM | `undefined` |
| `--offline` | Skip network calls, use bundled CVE snapshot | `false` |
| `--severity <level>` | Filter by minimum severity | `low` |
| `--config <path>` | Scan a specific config file | `undefined` |
| `--fix` | Automatically apply fixes where possible | `false` |
| `--submit` | Submit clean servers to ugig.net | `false` |
| `--ugig-key <key>` | ugig.net API key | `process.env.UGIG_API_KEY` |
| `--webhook <url>` | POST scan results to a webhook | `undefined` |
| `--slack-webhook <url>` | POST scan results to Slack | `undefined` |
| `--ci` | Enable CI mode | `false` |
| `--verbose` | Enable verbose output | `false` |
| `--dry-run` | Preview submission without sending | `false` |

</details>

### Output formats
- **CLI table**: Default color-coded output for terminal use.
- **JSON**: Use `--json` for machine-readable output.
- **SARIF**: Use `--sarif results.sarif` to import into GitHub Security tab.
- **HTML report**: Use `--html report.html` for a self-contained visual report.
- **SBOM**: Use `--sbom sbom.json` for CycloneDX v1.5 Software Bill of Materials.

### CI/CD integration

#### GitHub Action example
```yaml
name: MCP Security Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: rodolfboctor/mcp-scan@v1
        with:
          severity: high
          sarif-output: results.sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

### Library usage
```typescript
import { runScan } from 'mcp-scan';

const report = await runScan({
  severity: 'high',
  offline: true
});

console.log(`Found ${report.totalFindings} issues.`);
```

### Integrations
- **ugig.net**: MCP marketplace integration. Run `mcp-scan submit --ugig-key YOUR_KEY`.
- **GitHub Security**: Upload SARIF reports to see findings in your repository security tab.
- **Slack**: Send alerts to your team using `--slack-webhook <url>`.
- **Custom webhooks**: Integrate with any system using `--webhook <url>`.

### Architecture
<details>
<summary>Click to view pipeline details</summary>

1. **Detection**: Automatically locates configuration files for 15+ AI clients.
2. **Parsing**: Reads JSON, JSONC, and TOML formats into a unified internal model.
3. **Scanning**: Runs a pipeline of 13 specialized security scanners.
4. **Reporting**: Aggregates findings and generates output in multiple formats.
</details>

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

### License
MIT. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>
    Development by <a href="https://thynkq.com" target="_blank" rel="noopener">ThynkQ</a>.
  </sub>
</div>
