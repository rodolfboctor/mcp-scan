<div align="center">

# mcp-scan
<p>Security scanner for MCP servers.</p>

![npm version](https://img.shields.io/npm/v/mcp-scan?color=339DFF)
![downloads](https://img.shields.io/npm/dm/mcp-scan?color=339DFF)
![license](https://img.shields.io/npm/l/mcp-scan?color=339DFF)

</div>

## Why

In January 2026, 42% of MCP skills had vulnerabilities, 12% were confirmed malware. MCP servers have full system access. mcp-scan catches risks before they catch you.

## Quick Start

`npx mcp-scan` - that's it.

## What You Get

*(Terminal output screenshot placeholder)*

## What It Catches

| Check | Severity | Description |
|-------|----------|-------------|
| exposed-secret | CRITICAL | Detects hardcoded API keys and tokens in config files. |
| shell-injection-risk | CRITICAL | Args contain `${...}`, backticks, or `$(...)`. |
| known-malicious | CRITICAL | Package name matches a bundled blocklist. |
| unverified-source | HIGH | Not from official org and not in allowlist. |
| typosquat-detection | HIGH | Package names mimicking official server names. |
| excessive-permissions | HIGH | Access to sensitive directories like `/`, `~`, `~/.ssh`. |
| stale-server | HIGH | Package not updated in over 6 months. |
| broad-filesystem-access | MEDIUM | Short paths like `/Users` or `/home`. |
| missing-env-var | MEDIUM | Config references an unset environment variable. |
| duplicate-server | MEDIUM | Same server defined multiple times. |
| http-transport-no-auth | MEDIUM | HTTP/SSE transport missing authentication. |
| no-rate-limit | LOW | No rate limiting configured. |
| outdated-transport | LOW | Uses deprecated `sse` transport. |
| large-arg-list | LOW | Over 20 arguments provided. |

## All Commands

| Command | Description |
|---------|-------------|
| `mcp-scan` | Default scan of all AI tool configs. |
| `mcp-scan audit <server>` | Deep audit including npm registry checks. |
| `mcp-scan fix` | Interactive auto-fix for fixable issues. |
| `mcp-scan watch` | Watch config files and rescan on changes. |
| `mcp-scan ls` | List all detected MCP servers. |
| `mcp-scan init` | Create a `.mcp-scan.json` config. |
| `mcp-scan ci` | CI mode with JSON output and strict exits. |

## Supported AI Tools

* Claude Desktop
* Cursor
* VS Code
* Windsurf
* Claude Code

## CI Integration

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

## Contributing

Clone, install dependencies, test, and submit a PR.

```bash
git clone https://github.com/rodolfboctor/mcp-scan.git
cd mcp-scan
npm install
npm test
```

## Footer

Built by [Abanoub Rodolf Boctor](https://linkedin.com/in/abanoubrodolf) and [ThynkQ](https://thynkq.com).
