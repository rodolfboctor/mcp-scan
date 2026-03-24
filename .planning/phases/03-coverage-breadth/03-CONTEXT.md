# Phase 3: Coverage Breadth — Context

## Goal
Detect more tools than any competitor.

## Key Decisions
- Add to `src/config/paths.ts` the following tools: Zed (`~/.config/zed/settings.json`), Continue.dev (`~/.continue/config.json`), Cline (glob: `~/.vscode/extensions/saoudrizwan.claude-dev*/settings.json`), Roo Code (glob: `~/.vscode/extensions/rooveterinaryinc.roo-cline*/settings.json`), Amp (`~/.amp/config.json`), Plandex (`~/.plandex/config.json`), ChatGPT Desktop (macOS: `~/Library/Application Support/com.openai.chat/settings.json`), GitHub Copilot (`~/.config/github-copilot/apps.json`).
- Add `.mcp.json` detection in cwd (format: `{ "mcpServers": { ... } }`).
- Add `--ci` flag using `process.exitCode = 1` (NOT `process.exit(1)`). Read `src/index.ts` first.

## Implementation Approach
- Modify `src/config/paths.ts` to include the new tool paths and `.mcp.json` detection logic.
- Modify `src/index.ts` to implement the `--ci` flag functionality using `process.exitCode = 1`.

## Verification
- Run `npm run build` to ensure the project builds successfully.
- Run `npm test` to verify existing tests still pass and add new tests for the added paths and CI flag.
- Manually test the detection of the new config paths and the behavior of the `--ci` flag.

## canonical_refs
- GEMINI.md — all phase specs
- src/config/paths.ts — tool path definitions
- src/config/detector.ts — config detection logic
- src/commands/scan.ts — scan orchestration
- src/index.ts — CLI entry point

## code_context
- Existing tool path pattern: see src/config/paths.ts getConfigPaths()
- Existing scanner pattern: see src/scanners/config-scanner.ts
- Test pattern: see tests/ directory
