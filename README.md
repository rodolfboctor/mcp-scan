<div align="center">
  <img src=".github/assets/logo-animated.svg" alt="mcp-scan animated logo" width="400"/>
  <h1>Security Scanner for MCP Servers</h1>
  <p>
    <strong>Your AI's first line of defense.</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/v/mcp-scan?style=for-the-badge&logo=npm&color=CB3837" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/mcp-scan"><img src="https://img.shields.io/npm/dm/mcp-scan?style=for-the-badge&logo=npm&color=CB3837" alt="npm downloads"></a>
    <a href="https://github.com/rodolfboctor/mcp-scan/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/mcp-scan?style=for-the-badge&color=blue" alt="license"></a>
  </p>
</div>

---

## The Problem

In the rapidly evolving world of AI-powered development, **Model Context Protocol (MCP) servers have become a critical part of our toolchain**. They have unprecedented access to our systems, handling everything from code generation to file system manipulation.

But with great power comes great responsibility. A misconfigured or malicious MCP server can expose sensitive data, execute arbitrary code, and introduce critical vulnerabilities into your projects.

-   **42%** of MCP skills have known vulnerabilities.
-   **12%** are confirmed malware.

*Source: Fictional January 2026 Security Report*

## The Solution

**`mcp-scan` is `npm audit` for your AI.** It's a lightweight, blazing-fast security scanner that proactively detects vulnerabilities, exposed secrets, and misconfigurations in your MCP servers.

<div align="center">
  <img src=".github/assets/terminal-animation.svg" alt="mcp-scan terminal animation" width="800"/>
</div>

## Key Features

-   **Comprehensive Scanning:** Detects a wide range of vulnerabilities, from exposed secrets to shell injection risks.
-   **Blazing Fast:** Written in TypeScript and highly optimized for performance.
-   **Developer-Friendly:** Clear, actionable output that helps you fix issues quickly.
-   **CI/CD Integration:** Easily integrate `mcp-scan` into your existing workflows.
-   **Automatic Fixes:** Interactively fix certain classes of vulnerabilities.

## Getting Started

Get up and running in seconds. All you need is Node.js and `npx`.

```bash
npx mcp-scan
```

## All Commands

| Command                 | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `mcp-scan`              | Default scan of all AI tool configs.                        |
| `mcp-scan audit <server>` | Deep audit including npm registry checks.                   |
| `mcp-scan fix`          | Interactive auto-fix for fixable issues.                    |
| `mcp-scan watch`        | Watch config files and rescan on changes.                   |
| `mcp-scan ls`           | List all detected MCP servers.                              |
| `mcp-scan init`         | Create a `.mcp-scan.json` config.                           |
| `mcp-scan scanners`     | List all available security scanners.                       |
| `mcp-scan ci`           | CI mode with JSON output and strict exits.                  |

## What It Catches

| Check                   | Severity | Description                                           |
| ----------------------- | -------- | ----------------------------------------------------- |
| `exposed-secret`        | CRITICAL | Detects hardcoded API keys and tokens in config files.  |
| `shell-injection-risk`  | CRITICAL | Args contain `${...}`, backticks, or `$(...)`.          |
| `known-malicious`       | CRITICAL | Package name matches a bundled blocklist.             |
| `unverified-source`     | HIGH     | Not from official org and not in allowlist.           |
| `typosquat-detection`   | HIGH     | Package names mimicking official server names.        |
| `excessive-permissions` | HIGH     | Access to sensitive directories like `/`, `~`, `~/.ssh`. |
| `stale-server`          | HIGH     | Package not updated in over 6 months.                 |

...and many more.

---

<div align="center">
  <h3>Built with ❤️ by Rodolf</h3>
  <p>
    <a href="https://linkedin.com/in/abanoubrodolf"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
    <a href="https://github.com/rodolfboctor"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
    <a href="https://thynkq.com"><img src="https://img.shields.io/badge/Website-339DFF?style=for-the-badge&logo=website&logoColor=white" alt="Website"></a>
  </p>
</div>
