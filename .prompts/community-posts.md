# mcp-scan Community Post Drafts

All drafts are ready to post manually. Do NOT post these automatically.

---

## Hacker News (Show HN)

**Title:** Show HN: mcp-scan – security scanner for MCP server configurations

**URL:** https://github.com/rodolfboctor/mcp-scan

**Timing note:** Best posted on weekday mornings, 8-10am ET. Show HN posts must start with "Show HN:".

---

## Reddit r/cybersecurity

**Title:** mcp-scan: open-source security scanner for MCP (Model Context Protocol) server configs

**Body:**

MCP servers run with full filesystem and network access. Most people install them without auditing what they're actually running.

mcp-scan detects MCP server configs across 10 AI tool clients (Claude Desktop, Cursor, VS Code, Windsurf, Codex CLI, Claude Code, Zed, GitHub Copilot, Cline, Roo Code) and runs 13 security scanners against them.

What it checks:

- Leaked secrets and API keys (regex + entropy analysis)
- Known CVEs in MCP packages
- Dangerous permission patterns
- Transport security (HTTP vs HTTPS)
- Supply chain risks (typosquatting, registry verification)
- Tool poisoning and capability injection
- License compliance
- Exfiltration vectors via AST analysis

Output formats: CLI table, JSON, SARIF (GitHub Security tab), HTML report, CycloneDX SBOM.

One command: `npx mcp-scan`

GitHub: https://github.com/rodolfboctor/mcp-scan
npm: https://www.npmjs.com/package/mcp-scan

GitHub Action included for CI/CD integration.

**Note on r/netsec:** That subreddit has strict rules against self-promotion and requires established community participation history. Use r/cybersecurity instead, or only post to r/netsec if you have prior participation history there.

---

## Reddit r/ClaudeAI

**Title:** I built mcp-scan, a security scanner for your MCP server configs

**Body:**

If you use MCP servers with Claude Desktop, they run with full access to your filesystem and network. mcp-scan checks your configs for:

- Secrets and API keys accidentally left in config files
- Known vulnerabilities in MCP packages
- Suspicious permission patterns
- Exfiltration vectors
- Tool poisoning attacks

It auto-detects configs for Claude Desktop, Cursor, VS Code, Windsurf, and 6 other AI clients.

One command: `npx mcp-scan`

https://github.com/rodolfboctor/mcp-scan

---

## Reddit r/LocalLLaMA

**Title:** mcp-scan: security scanner that audits MCP server configs across 10 AI clients

**Body:**

Built a CLI tool that scans your MCP (Model Context Protocol) server configurations for security issues. MCP servers get broad system access and most people never audit what they're running.

Supports Claude Desktop, Cursor, VS Code, Windsurf, Codex CLI, Zed, GitHub Copilot, Cline, Roo Code, and Claude Code.

13 scanners: secrets, CVEs, permissions, transport, registry, license, supply chain, typosquatting, tool poisoning, exfiltration, AST analysis, config validation, prompt injection.

`npx mcp-scan`

GitHub: https://github.com/rodolfboctor/mcp-scan

---

## X/Twitter

mcp-scan v1.7.0

Security scanner for MCP server configurations.

MCP servers run with full filesystem access. Most users never audit their configs.

`npx mcp-scan`

10 AI clients. 13 scanners. SARIF + GitHub Action for CI.

github.com/rodolfboctor/mcp-scan

---

## MCP community subreddits (check before posting)

Before posting, check for active MCP-focused subreddits. Search Reddit for:
- r/mcp_servers
- r/ModelContextProtocol
- r/mcptools

These communities are forming and may be receptive to security tooling. Verify activity level before investing time in a post.
