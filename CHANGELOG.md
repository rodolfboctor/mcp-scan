# Changelog

All notable changes to mcp-scan are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.7.0] - 2026-03-24

### Added
- Interactive TUI dashboard command (`mcp-scan dashboard`) built with blessed-contrib.
- Local proxy server command (`mcp-scan proxy`) that intercepts MCP server traffic with PII masking and a privacy rule engine.
- Privacy engine with configurable PII masking rules and full test coverage.
- Self-contained HTML security report output (`--html report.html`).
- Tool Poisoning and Capability Injection scanner for MCP-specific attack classes.
- Entropy-based secret detection for high-entropy strings in env vars and args.
- CycloneDX v1.5 SBOM generation (`--sbom sbom.json`).
- Scan report diff command (`mcp-scan diff old.json new.json`).
- Webhook and Slack alerting integrations (`--webhook`, `--slack-webhook`).
- License compliance scanner (GPL, AGPL, LGPL, and unlicensed package detection).
- Cross-origin exfiltration analysis in AST scanner.
- Policy engine with `.mcp-scan.json` support for allowed/blocked packages and ignore rules.
- Persistent audit logging and scan history trends command (`mcp-scan history`).
- Offline mode with bundled CVE snapshot (`--offline`).
- Remediation confidence scoring and auto-apply logic in the fix command.
- Finding suppression via `.mcp-scan-ignore` file.
- Enhanced watch mode with delta reporting (webhook fires only on new findings).
- System diagnostic command (`mcp-scan doctor`).
- Multi-config report aggregation command (`mcp-scan report --configs dir/`).
- Server fingerprinting and mutation detection in the audit command.

### Fixed
- Build: copy `cve-snapshot.json` to `data/` directory on build.
- Missing `action.yml` output declarations for all finding count outputs.
- `detectTools()` dependency injection in `ls`, `watch`, and `audit` commands.

## [1.5.0] - 2026-03-24

### Added
- Community health files: CONTRIBUTING.md, SECURITY.md, CHANGELOG.md.
- Pre-commit hook configuration.
- GitHub Action with SARIF output for CI/CD integration.
- Public library API (`import { runScan } from 'mcp-scan'`), ESM and CJS dual output.

### Fixed
- `scanners` command crash in ESM builds (`__dirname` not defined). Replaced filesystem-based discovery with a static scanner list.
- Unified tsup build config with correct shims for ESM/CJS dual output.

### Changed
- README rewritten with full CLI reference, 14 supported clients, GitHub Action docs, and SARIF integration guide.

## [1.2.0] - 2026-03-24

### Added
- Prompt Injection scanner for malicious instructions in server descriptions and args.
- OSV.dev API integration for real-time package vulnerability lookups.
- Env leak scanner for detecting secrets in `.env` files within server directories.
- ugig.net MCP marketplace integration via `--submit` flag and `UGIG_API_KEY`.
- SARIF report output (`--sarif`).

## [1.1.0] - 2026-03-23

### Added
- 8 new AI tool config paths: Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, GitHub Copilot.
- Detection for project-level `.mcp.json` files.
- `--ci` flag for strict exit codes and JSON output in automated environments.
- Gemini CLI support.
- Codex CLI support with TOML parsing.
- Homoglyph and Levenshtein-based typosquatting detection.
- `--fix` flag for automated remediation of secrets and HTTP transports.
- Watch command improvement to monitor parent directories.

### Fixed
- Config deduplication: same config file detected by multiple tools no longer causes double reporting.
- Guard against undefined `command` in scanners.

## [1.0.0] - 2026-03-23

### Added
- Initial release.
- Core scanner pipeline: secrets, permissions, registry blocklist, typosquatting, transport security, and AST analysis.
- Config auto-detection for Claude Desktop, Cursor, VS Code, Claude Code, and Windsurf.
- JSON and TOML config parsing.
- Branded CLI output with severity-sorted findings and fix recommendations.
- Exit code 1 on critical or high findings for CI use.
