# Concerns

## Technical Debt
- **Type Safety**: Some areas (like `parser.ts` and `index.ts`) still use `any` or loose typing, which could lead to runtime errors if configurations don't match expectations.
- **Config Writing**: While `writer.ts` is atomic, it doesn't currently validate that the updated configuration is still valid JSON/TOML before writing.

## Performance
- **Network Calls**: `package-scanner.ts` makes network calls to the npm registry. During large scans or in CI environments with poor connectivity, this could slow down the tool significantly. Caching is not currently implemented.
- **Sequential Scan**: Scanners run sequentially per server. For users with dozens of servers, parallelizing the scanning logic could improve performance.

## Security
- **Heuristic-Based**: The tool relies on regex and blocklists. While effective for common patterns, it may miss sophisticated or novel attacks (false negatives) and may flag legitimate configurations (false positives).
- **Hardcoded Patterns**: The `SECRET_PATTERNS` list is hardcoded. It needs a mechanism for easier updates or a community-driven remote feed to stay effective.

## Fragile Areas
- **Config Detection**: Path resolution for AI tools (`paths.ts`) is based on default installation locations. If a user has a custom installation path, the tool will fail to find the configuration.
- **TOML Parsing**: The Codex CLI support is new and relies on `smol-toml`. Its robustness against varied TOML styles remains to be seen.
