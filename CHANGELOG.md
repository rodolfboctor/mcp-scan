# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-03-24

### Added
- Self-contained HTML security report output (`--html report.html`).
- Tool Poisoning & Capability Injection scanner for MCP-specific attack classes.
- Entropy-based secret detection for high-entropy strings in env/args.
- CycloneDX v1.5 SBOM generation (`--sbom sbom.json`).
- Scan report diff command (`mcp-scan diff old.json new.json`).
- Webhook and Slack alerting integrations (`--webhook`, `--slack-webhook`).
- License compliance scanner (GPL, AGPL, UNLICENSED detection).
- Cross-origin exfiltration analysis in AST scanner.
- Policy engine with `.mcp-scan.json` support (allowed/blocked packages, etc).
- Persistent audit logging and scan history command (`mcp-scan audit`).
- Offline mode with bundled CVE snapshot (`--offline`).
- Remediation confidence scoring and auto-apply logic for fixes.
- Finding suppression via `.mcp-scan-ignore` file.
- Enhanced watch mode with live dashboard and delta reporting.
- System diagnostic command (`mcp-scan doctor`).
- Multi-config report aggregation command (`mcp-scan report --configs dir/`).
- Upgrade Advisor for packages with newer versions or resolved vulnerabilities.

## [1.5.0] - 2026-03-24

### Added
- Community health docs: CONTRIBUTING.md, SECURITY.md, CHANGELOG.md.
- Pre-commit hook configuration.

### Fixed
- `scanners` command crash in ESM builds (`__dirname` not defined). Replaced filesystem-based scanner discovery with static list.
- Unified tsup build config with correct shims for ESM/CJS dual output.

### Changed
- README rewritten: 10 scanners, 14 supported clients, GitHub Action + SARIF docs, full CLI reference.

## [1.4.0] - 2026-03-24

### Added
- GitHub Action support for CI/CD integration.
- SARIF report output for GitHub Security Scanning (`--sarif` flag).
- Example workflow for automated MCP security scans.

## [1.3.0] - 2026-03-24

### Added
- Exported public API as an importable npm library (ESM and CJS support).
- Programmatic usage guide in README.
- Standalone library build via tsup.

## [1.2.0] - 2026-03-24

### Added
- Prompt Injection scanner for detecting malicious instructions in server descriptions and args.
- OSV.dev integration for real-time package vulnerability lookups.
- .env leak scanner for detecting exposed secrets in project directories.
- New finding IDs for advanced security checks.

## [1.1.0] - 2026-03-23

### Added
- Support for 8 new AI tool config paths (Zed, Continue.dev, Cline, Roo Code, etc.).
- Detection for project-level `.mcp.json` files.
- `--ci` flag for strict exit codes and JSON output in automated environments.

## [1.0.4] - 2026-03-23

### Fixed
- Config deduplication bug where the same server in multiple tools caused double reporting.

## [1.0.3] - 2026-03-23

### Added
- Initial public release of `mcp-scan`.
- Core scanners: secrets, permissions, registry, typosquatting, transport, AST analysis.
- Branded CLI output and interactive fixes.
- Support for Claude Desktop, Cursor, VS Code, and more.

---
Built by [Abanoub Rodolf Boctor](https://linkedin.com/in/abanoubrodolf) and [ThynkQ](https://thynkq.com).
