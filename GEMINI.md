# mcp-scan Project Instructions

This is a Node.js/TypeScript CLI tool called `mcp-scan`. Security scanner for MCP server configurations.

## Build Commands
- `npm run build` - Build with tsup
- `npm run lint` - TypeScript check (tsc --noEmit)
- `npm test` - Run Vitest tests
- `npm run dev` - Watch mode

## Stack
- Node.js 18+, TypeScript strict, ESM
- Commander.js, Chalk 5+, Ora, cli-table3, Zod
- tsup (bundler), Vitest (tests)

## Rules
- All files under 200 lines
- Named exports only
- No `any` types
- Graceful error handling everywhere (never crash on bad input)
- Offline-first: default scan works without network
- Cross-platform: macOS, Linux, Windows

## Full spec
Read @CODEX_PROMPT.md for the complete project specification.
