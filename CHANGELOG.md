# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
