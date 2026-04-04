# Codebase Map

## `src/commands/`
- `scan.ts`: Core scanning logic orchestrating all scanners.
- `audit.ts`: Deep audit command logic.
- `fix.ts`: Auto-fix command logic.
- `watch.ts`: File watcher for continuous scanning.
- `ls.ts`: List detected servers.
- `init.ts`: Generate config.
- `ci.ts`: CI environment scanning.
- `diff.ts`: Compare two scan reports.
- `history.ts`: Show scan history.
- `doctor.ts`: System diagnostic check.
- `report.ts`: Multi-config reporting.
- `dashboard.ts`: Interactive TUI dashboard.
- `proxy.ts`: Runtime proxy guard.
- `scanners.ts`: List available scanners.
- `submit.ts`: Submit results to ugig.net.

## `src/config/`
- `detector.ts`: Detect installed MCP tool configs.
- `parser.ts`: Parse MCP configs (JSON, JSONC, TOML).
- `paths.ts`: Paths to common config files.
- `writer.ts`: Atomic write logic for configs.

## `src/scanners/`
- `ast-scanner.ts`: AST analysis for malicious code.
- `config-scanner.ts`: Shell injection checks.
- `env-leak-scanner.ts`: Environment variable leak checks.
- `license-scanner.ts`: License compatibility checks.
- `package-scanner.ts`: Package health checks.
- `permission-scanner.ts`: Filesystem permission checks.
- `prompt-injection-scanner.ts`: Prompt injection patterns.
- `registry-scanner.ts`: Known malicious and unverified source checks.
- `secret-scanner.ts`: Hardcoded secrets checks.
- `supply-chain-scanner.ts`: Supply chain trust checks.
- `tool-poisoning-scanner.ts`: Tool output poisoning checks.
- `transport-scanner.ts`: Transport protocol security.
- `typosquat-scanner.ts`: Typosquatting detection.

## `src/utils/`
- `audit-logger.ts`: Persistent audit log.
- `dashboard-ui.ts`: TUI rendering logic.
- `html-reporter.ts`: HTML output.
- `json-reporter.ts`: JSON output.
- `levenshtein.ts`: Distance calculation for typosquatting.
- `logger.ts`: Terminal styling.
- `privacy-engine.ts`: PII masking.
- `reporter.ts`: Human-readable terminal output.
- `rule-engine.ts`: Custom rule execution.
- `sarif-reporter.ts`: SARIF format output.
- `sbom-generator.ts`: SBOM generation.
- `spinner.ts`: Terminal spinner.
- `webhook.ts`: Webhook notifications.

## Bugs & Gaps
- `submit.ts` needed `silent` flag passed in multiple modes.
- `audit-logger.ts` had a bug referencing missing properties on `ServerScanResult`.
- Some scanners may throw on undefined commands/URLs.
- `parser.ts` should handle JSON parsing robustly.
- Some tests are missing for edge cases.

## Needs More Tests
- Test cases for missing commands/args.
- Test cases for malformed config structures.