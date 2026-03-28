# mcp-scan

[![CI](https://github.com/rodolfboctor/mcp-scan/actions/workflows/ci.yml/badge.svg)](https://github.com/rodolfboctor/mcp-scan/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/mcp-scan.svg)](https://badge.fury.io/js/mcp-scan)
[![npm downloads](https://img.shields.io/npm/dw/mcp-scan)](https://www.npmjs.com/package/mcp-scan)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/rodolfboctor/mcp-scan?style=social)](https://github.com/rodolfboctor/mcp-scan/stargazers)

**Open-source security scanner for Model Context Protocol (MCP) servers.**

MCP servers run with full access to your filesystem, API keys, and network. mcp-scan audits every MCP server configuration on your system — detecting leaked secrets, prompt injection risks, supply-chain vulnerabilities, and data flow issues before they become incidents.

```bash
npx mcp-scan@latest
```

No installation. No sign-up. No telemetry. Zero network requests during scanning.

---

## Why mcp-scan?

MCP servers are the new attack surface for AI-powered development. They run silently alongside your AI tools with shell access, filesystem permissions, and network egress. A single malicious or misconfigured server can exfiltrate API keys, inject instructions into your AI sessions, or become a supply-chain entry point.

mcp-scan was built after analyzing hundreds of publicly available MCP server configs and finding patterns that existing security tools miss: credential relay, prompt injection via tool descriptions, typosquatting near popular packages, and data sent to unexpected endpoints.

**Featured in [Stytch Engineering Blog](https://stytch.com/blog/npm-audit-for-mcp-security)**: *"npm-audit for MCP security: A deep-dive on mcp-scan"*

---

## What It Detects

| Check | Severity | Description |
|-------|----------|-------------|
| Data Exfiltration | CRITICAL | Tool reads filesystem and sends data to a network endpoint |
| Credential Relay | CRITICAL | Environment variables or secrets passed to external APIs |
| Known Malicious Package | CRITICAL | Config references packages on the known-bad list |
| Exposed Secret | CRITICAL | Hardcoded API keys, tokens, or passwords in config |
| Prompt Injection | HIGH | Instructions embedded in tool names or descriptions |
| Typosquatting | HIGH | Package name closely resembles a trusted popular package |
| Supply Chain Risk | HIGH | Low-trust package with no history, stars, or maintainers |
| Outdated Package with CVEs | MEDIUM | Package has known vulnerabilities in the installed version |
| Overly Broad Permissions | MEDIUM | Server requests filesystem or shell access it does not need |
| Unverified Source | LOW | Package not from a verified registry or organization |
| Missing Transport Security | LOW | MCP server communicates over unencrypted transport |

---

## Supported AI Tools

mcp-scan automatically detects configurations for **16+ AI tool clients**:

| Category | Tools |
|----------|-------|
| **AI Assistants** | Claude Desktop, Claude Code, Gemini CLI, Codex CLI |
| **Editors** | VS Code, Cursor, Windsurf, Zed |
| **AI Coding Tools** | Cline, Roo Code, Continue, Amp, Plandex |
| **Other** | ChatGPT Desktop, GitHub Copilot |

---

## v2.0 Features

- **Data Flow Analysis** — Trace where your data goes after MCP processes it
- **Network Egress Monitor** — See every endpoint your servers contact
- **Privacy Assessment** — One-command PII and compliance report
- **Policy Engine** — Custom security rules in `.mcp-scan-policy.yml`
- **Compliance Mapping** — SOC 2, GDPR, HIPAA, PCI-DSS, NIST 800-53
- **SBOM Generation** — CycloneDX and SPDX output
- **GitHub Action** — Scan on every PR with SARIF upload to GitHub Security tab
- **17+ Scanners** — Secrets, supply chain, prompt injection, data flow, and more

---

## All Commands

```bash
# Full security scan (auto-detects all AI tool configs)
npx mcp-scan@latest

# Output as JSON for CI/CD pipelines
npx mcp-scan@latest --json

# Privacy impact assessment and data map
npx mcp-scan@latest privacy

# Compliance report (SOC 2, GDPR, HIPAA, PCI-DSS, NIST 800-53)
npx mcp-scan@latest compliance

# Software Bill of Materials (CycloneDX or SPDX)
npx mcp-scan@latest sbom

# Validate custom security policies
npx mcp-scan@latest policy

# CI mode — exit 1 if findings above threshold
npx mcp-scan@latest --ci --severity-threshold HIGH
```

---

## GitHub Actions Integration

Add mcp-scan to your CI pipeline. Results appear in the **GitHub Security tab** via SARIF 2.1.0:

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Scan MCP configurations
    uses: rodolfboctor/mcp-scan@v2
    with:
      severity-threshold: MEDIUM
      sarif-upload: true
```

---

## Custom Security Policies

Define your own rules in `.mcp-scan-policy.yml`:

```yaml
rules:
  - name: no-external-endpoints
    description: Block servers contacting endpoints outside your org domain
    match:
      network_egress:
        not_in_domain: "*.mycompany.com"
    severity: HIGH

  - name: require-approved-packages
    description: Only allow packages from your approved list
    match:
      package:
        not_in_allowlist: true
    severity: CRITICAL
```

---

## Compliance Mapping

| Framework | Controls Covered |
|-----------|-----------------|
| SOC 2 | CC6.1, CC6.6, CC6.7, CC7.1 |
| GDPR | Art. 25, Art. 32, Art. 33 |
| HIPAA | 164.312(a)(1), 164.312(e)(1) |
| PCI-DSS | Req. 6, Req. 10, Req. 11 |
| NIST 800-53 | CA-7, RA-5, SA-11, SI-2 |

---

## Privacy & Security Architecture

mcp-scan runs **entirely locally**. It reads config files from disk, performs all analysis in-process, and never sends data anywhere.

- Zero network requests during scanning
- No API keys required
- No data leaves your machine
- No account or sign-up needed
- Fully open source — audit the code yourself

---

## Roadmap

- **v2.1** — Runtime Monitoring
- **v2.2** — Sandboxed Execution
- **v2.3** — Real-Time Alerting

---

## Installation

Use without installing (always latest version):

```bash
npx mcp-scan@latest
```

Install globally:

```bash
npm install -g mcp-scan
mcp-scan
```

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

For security disclosures: see [SECURITY.md](SECURITY.md).

---

## License

MIT — built by [Abanoub Rodolf Boctor](https://thynkq.com/about) · [ThynkQ](https://thynkq.com)
