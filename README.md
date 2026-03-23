<div align="center">
  <img src=".github/assets/logo-animated.svg" alt="mcp-scan animated logo" width="400"/>
  <h1>Security scanner for your MCP server configs.</h1>
  <p>
    <strong>Find leaked secrets, typosquatting, and misconfigurations before they bite you.</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/v/mcp-scan?style=for-the-badge&logo=npm&color=CB3837" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/dm/mcp-scan?style=for-the-badge&logo=npm&color=CB3837" alt="npm downloads"></a>
    <a href="https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/mcp-scan?style=for-the-badge&color=blue" alt="license"></a>
  </p>
</div>

---

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

Cursor - shady-analytics
Config: /Users/rodolf/.cursor/mcp.json
┌──────────┬───────────────────────┬──────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│ Severity │ ID                    │ Description                                                      │ Recommendation                                           │
├──────────┼───────────────────────┼──────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ HIGH     │ typosquat-detection   │ Package 'mcp-analytics-proo' looks suspiciously like official... │ Verify you meant to install this package and not '@mo... │
└──────────┴───────────────────────┴──────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

VS Code - github-leaky
Config: /Users/rodolf/.vscode/mcp.json
┌──────────┬───────────────────┬──────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│ Severity │ ID                │ Description                                                      │ Recommendation                                           │
├──────────┼───────────────────┼──────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ CRITICAL │ exposed-secret    │ Exposed GitHub Token in environment variable 'GITHUB_TOKEN'.     │ Move the secret to a secure environment variable and r... │
└──────────┴───────────────────┴──────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────
✖ CRITICAL: 2 servers scanned in 12ms. Critical: 1, High: 1, Medium: 0.
```

## What it checks

| Check                | What it catches                                      | Example                                             |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| **Secret detection** | API keys, tokens in env vars and args                | `GITHUB_TOKEN=ghp_...`                              |
| **Typosquat detection**| Misspelled package names                             | `@modelcontextprotocol` vs `@modeicontextprotocol`  |
| **Permission scanning**| Overly broad filesystem access                       | `/` instead of `~/projects`                         |
| **Config validation**  | Missing env vars, malformed JSON, injection in args  | `args: ["${rm -rf /}"]`                              |
| **Transport security** | HTTP instead of HTTPS for SSE servers                | `url: "http://example.com"`                         |

## Supported tools

- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Cursor**: `~/.cursor/mcp.json`
- **VS Code Copilot**: `~/.vscode/mcp.json`
- **Claude Code**: `~/.claude.json`
- **Windsurf**: `~/.codeium/windsurf/mcp_config.json`
- **Gemini CLI**: `~/.gemini/settings.json`
- **Codex CLI**: `~/.codex/config.toml`

## CI/CD usage

You can use `mcp-scan` in your GitHub Actions workflow to automatically scan for vulnerabilities on every push and pull request.

```yaml
name: MCP Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx mcp-scan ci
```

## JSON output

For programmatic use, you can get the scan results in JSON format using the `--json` flag.

```bash
mcp-scan --json
```

## Badge

If you are a marketplace or a server author, you can use our "Secured by mcp-scan" badge to show that your MCP configs are audited.

### Shield.io (Recommended)
```markdown
[![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-4ade80?style=for-the-badge)](https://github.com/rodolfboctor/mcp-scan)
```

### Custom SVG
```markdown
![Secured by mcp-scan](https://raw.githubusercontent.com/rodolfboctor/mcp-scan/main/.github/assets/badge-secured.svg)
```

## Used by

- **[ugig.net](http://ugig.net/mcp)** - MCP server marketplace with integrated security scanning

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

[MIT](https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE)

---

<div align="center">
  <h3>Built with ❤️ by Rodolf</h3>
  <p>
    <a href="https://linkedin.com/in/abanoubrodolf"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
    <a href="https://github.com/rodolfboctor"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
    <a href="https://thynkq.com"><img src="https://img.shields.io/badge/Website-339DFF?style=for-the-badge&logo=website&logoColor=white" alt="Website"></a>
  </p>
</div>
