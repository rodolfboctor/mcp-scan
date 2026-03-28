**Twitter/X Thread:**

1/ mcp-scan v2.0 is out. It went from a config scanner to a full security platform for MCP servers. 4 new scanners, compliance mapping, SBOM generation, and a YAML policy engine.

2/ The big one: Data Flow Analyzer. It traces where your data goes. If an MCP server reads your files and also has network access, you'll know about it before it phones home.

3/ Network Egress Monitor flags every outbound endpoint your servers talk to. Raw IPs, obfuscated URLs, known telemetry domains. All surfaced.

4/ `mcp-scan compliance --framework soc2` maps your findings to SOC 2, GDPR, HIPAA, PCI-DSS, and NIST controls. `mcp-scan privacy` generates a privacy impact report.

5/ Policy Engine: define your security rules in `.mcp-scan-policy.yml`. Block packages, suppress rules, set severity thresholds. SBOM output in CycloneDX v1.5 and SPDX 2.3.

6/ GitHub Action now supports SARIF upload. Findings show up directly in the Security tab.

7/ `npx mcp-scan@latest` to try it. GitHub: github.com/rodolfboctor/mcp-scan

**LinkedIn Post:**

mcp-scan v2.0 is live.

When I built the first version, it checked MCP configs for hardcoded secrets and known malicious packages. Useful, but limited. The real question was always: where does my data actually go when I connect an AI tool to an MCP server?

v2.0 answers that. The new Data Flow Analyzer maps source-to-sink paths in your MCP server configs. If a server can read your filesystem and also make HTTP requests, that gets flagged. If credential env vars are exposed to a network-capable server, that's a CRITICAL finding.

What else is new:
- Network Egress Monitor: detects all outbound endpoints
- Compliance mapping: SOC 2, GDPR, HIPAA, PCI-DSS, NIST
- Policy engine: custom rules in YAML
- SBOM generation: CycloneDX + SPDX
- Privacy impact assessments

17 scanners total. 200+ tests. Free and open source.

github.com/rodolfboctor/mcp-scan

#MCP #Security #OpenSource

**Reddit Post (r/cybersecurity):**

**Title:** mcp-scan v2.0: open-source security platform for MCP servers (data flow analysis, compliance mapping, SBOM)

I maintain mcp-scan, an open-source security scanner for Model Context Protocol servers. Just shipped v2.0.

The short version: MCP lets AI tools (Claude, Cursor, Windsurf, etc.) connect to external servers that can read your files, run commands, and make network requests. mcp-scan tells you what those servers are actually doing with your data.

New in v2.0:

* **Data Flow Analyzer** - traces paths from sensitive sources (filesystem, env vars) to external sinks (HTTP endpoints). Flags read-and-send patterns.
* **Network Egress Monitor** - lists every outbound endpoint. Catches raw IPs, obfuscated URLs, known telemetry.
* **Compliance mapping** - maps findings to SOC 2, GDPR, HIPAA, PCI-DSS, NIST control IDs.
* **Policy engine** - `.mcp-scan-policy.yml` for custom rules (block packages, suppress findings, enforce severity thresholds).
* **SBOM generation** - CycloneDX v1.5 and SPDX 2.3.
* **Privacy command** - PII detection and privacy impact reports.

17 scanners, 200+ tests, zero telemetry. MIT licensed.

Interested in feedback on the data flow analysis specifically. The static analysis is heuristic-based right now (matching known package names and config patterns). Considering adding actual AST traversal of server source code for v2.1.

GitHub: [link]

`npx mcp-scan` to try it.
