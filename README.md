# mcp-scan v2.0 - Now with Data Controls

![CI](https://github.com/rodolfboctor/mcp-scan/actions/workflows/ci.yml/badge.svg)
[![npm version](https://badge.fury.io/js/mcp-scan.svg)](https://badge.fury.io/js/mcp-scan)
[![npm downloads](https://img.shields.io/npm/dw/mcp-scan)](https://www.npmjs.com/package/mcp-scan)
![License](https://img.shields.io/npm/l/mcp-scan)

Know where your data goes. MCP servers run with full access to your filesystem,
API keys, and network. mcp-scan v2.0 maps data flows, monitors network egress,
generates privacy assessments, and enforces custom security policies.

## New in v2.0
- **Data Flow Analysis**: Trace where your data goes after MCP processes it.
- **Network Egress Monitor**: See every endpoint your servers contact.
- **Privacy Assessment**: One-command PII and compliance report.
- **Policy Engine**: Custom security rules in `.mcp-scan-policy.yml`.
- **Compliance Mapping**: SOC 2, GDPR, HIPAA, PCI-DSS, NIST 800-53.
- **SBOM Generation**: CycloneDX and SPDX output.
- **GitHub Action**: Scan on every PR with SARIF upload.
- **17+ Scanners**: Secrets, supply chain, prompt injection, data flow, and more.

## Quick Start
```bash
npx mcp-scan@latest
```

## What It Catches
| Check | Severity | Description |
|---|---|---|
| Data Exfiltration | CRITICAL | Detects when a tool reads from the filesystem and sends data to a network location. |
| Credential Relay | CRITICAL | Finds tools that pass environment variables or other secrets to external APIs. |
| Known Malicious Package | CRITICAL | Checks against a list of known malicious MCP servers. |
| Exposed Secret | CRITICAL | Finds hardcoded API keys and other secrets in your configuration. |
| ...and many more | | |

## All Commands
| Command | Description |
|---|---|
| `scan` | Full security scan of all detected AI tool configs. |
| `privacy` | Generate a privacy impact assessment and data map. |
| `compliance` | Generate compliance reports (SOC 2, GDPR, etc.). |
| `sbom` | Generate Software Bill of Materials (SBOM). |
| `policy` | Validate custom security policies. |
| `...` | |

## Supported AI Tools
mcp-scan automatically detects configurations for over 16 AI tools, including VS Code, Cursor, Claude Desktop, and more.

## GitHub Action
```yaml
- uses: rodolfboctor/mcp-scan@v2
  with:
    severity-threshold: MEDIUM
    sarif-upload: true
```

## Coming Soon
- **v2.1**: Runtime Monitoring
- **v2.2**: Sandboxed Execution
- **v2.3**: Real-Time Alerting

## Contributing
Contributions are welcome! Please open an issue or PR.

## License
MIT

---
Built by [Abanoub Rodolf Boctor](https://linkedin.com/in/abanoubrodolf) and [ThynkQ](https://thynkq.com).
