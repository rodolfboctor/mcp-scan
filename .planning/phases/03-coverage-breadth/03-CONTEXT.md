# Phase 3: Coverage Breadth — Context

## Goal
Detect more tools than any competitor.

## Key Decisions
- Add to `src/config/paths.ts`:
  - Zed: `~/.config/zed/settings.json`
  - Continue.dev: `~/.continue/config.json`
  - Cline: `~/.vscode/extensions/saoudrizwan.claude-dev*/settings.json` (glob)
  - Roo Code: `~/.vscode/extensions/rooveterinaryinc.roo-cline*/settings.json` (glob)
  - Amp: `~/.amp/config.json`
  - Plandex: `~/.plandex/config.json`
  - ChatGPT Desktop: `~/Library/Application Support/com.openai.chat/settings.json` (macOS)
  - GitHub Copilot: `~/.config/github-copilot/apps.json`
- Add `.mcp.json` detection in current working directory (format: `{ "mcpServers": { ... } }`).
- Add `--ci` flag in `src/index.ts`.
- Ensure exit code 1 if findings exist when in CI mode by setting `process.exitCode = 1`.
- Version bump: 1.0.4 → 1.1.0.

## Implementation Approach
1. Update `src/config/paths.ts` to include the new tool paths and ensure glob support for Cline/Roo Code.
2. Update `src/config/detector.ts` to detect `.mcp.json` in the current directory.
3. Update `src/index.ts` to add the `--ci` flag and implement the requested exit code behavior.
4. Update `package.json` version to 1.1.0.

## Verification
- Run `npm run build` and `npm run lint`.
- Run `npm test` to ensure no regressions.
- Create mock config files for the new tools and verify they are detected.
- Test the `--ci` flag with a known vulnerable config.

## canonical_refs
- GEMINI.md — all phase specs
- src/config/paths.ts — tool path definitions
- src/config/detector.ts — config detection logic
- src/commands/scan.ts — scan orchestration

## code_context
- Existing tool path pattern: see src/config/paths.ts getConfigPaths()
- Existing scanner pattern: see src/scanners/config-scanner.ts
- Test pattern: see tests/ directory
