# Contributing to mcp-scan

## Development setup

```bash
git clone https://github.com/rodolfboctor/mcp-scan.git
cd mcp-scan
npm install
npm test        # vitest unit tests
npm run build   # TypeScript compile via tsup
node dist/index.js  # smoke test
```

## Code style

- TypeScript strict mode throughout.
- Dependency injection: pass `{ fs, os, process }` to functions that need system access. This is what makes unit tests work without mocking globals.
- Tests: vitest, files in `tests/`.
- No new runtime dependencies without discussion. The package ships to users; every dep is a supply chain risk.

## Project structure

```
src/
  commands/     CLI command implementations (scan, fix, watch, audit, etc.)
  scanners/     Individual security scanner modules
  config/       Config detection (detector.ts) and parsing (paths.ts)
  types/        TypeScript interfaces and Zod schemas
  utils/        Logger, reporter, SARIF/HTML/SBOM generators, webhook
  data/         CVE snapshot, known malicious packages, official server list
tests/
  scanners/     Unit tests per scanner
  commands/     Command-level tests
  config/       Config detection tests
```

## Adding a scanner

1. Create `src/scanners/your-scanner.ts`.
2. Export a function that takes a `ResolvedServer` and returns `Finding[]`. Keep it synchronous if possible.
3. Import and call it in `src/commands/scan.ts` inside the `allFindings` array.
4. Add tests in `tests/scanners/your-scanner.test.ts`. Cover the happy path, the finding path, and edge cases (empty args, missing command, etc.).

## Pull requests

- One logical change per PR.
- All tests pass: `npm test`.
- Build passes: `npm run build`.
- Describe what changed and why in the PR description.
- Scanner changes require tests.
- New dependencies require justification.

## Commit style

Conventional commits:
- `feat:` new functionality
- `fix:` bug fix
- `docs:` documentation only
- `test:` adding or fixing tests
- `refactor:` no behavior change
- `chore:` maintenance, deps, build

First line under 72 characters. Specific about what changed and where.

## Reporting a malicious package

If you find a malicious MCP package in the wild, open an issue with the package name and evidence. It gets added to the blocklist same day.
