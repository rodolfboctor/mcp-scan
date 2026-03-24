# mcp-scan v1.0.3 — Premium CLI & Marketplace Integration

## What is mcp-scan

A Node.js/TypeScript CLI security scanner for MCP (Model Context Protocol) server configurations. Published on npm as `mcp-scan`. Scans configs across 7 AI coding clients (Claude Desktop, Cursor, VS Code, Claude Code, Windsurf, Gemini CLI, Codex CLI) using 7 parallel scanners (secrets, typosquat, malicious packages, permissions, AST analysis, transport, config validation).

## What we're building in v1.0.3

Two features that upgrade the tool from functional to premium:

### Feature 1: Premium CLI Visual Output

Upgrade the terminal output to match the quality of tools like Vercel CLI and Snyk. Every character placement intentional.

**Changes to `src/utils/reporter.ts`:**
- Header: rounded box-drawing chars (╭╮╰╯) with version number, branded border in #339DFF
- Server findings: tree-line card connectors (┌│└) in brand blue, creating visual "cards" per server
- Clean servers: aligned with "0 issues" column for scannability
- Summary section: structured block with total servers, client count, scan time, severity breakdown
- Footer: refined "by Rodolf · thynkQ thynkq.com" with accent gray (#8B949E) separators, underlined URL

**Changes to `src/utils/spinner.ts`:**
- Spinner color from cyan to brand blue

**Changes to `README.md`:**
- Demo output block updated to match new visual format

**Brand colors (already in codebase):**
- #339DFF — ThynkQ blue (primary accent, Q logo, borders)
- #F85149 — Critical red
- #F0883E — High orange
- #D29922 — Medium yellow
- #3FB950 — Pass green
- #8B949E — Accent gray (NEW — secondary text, separators)

**Attribution rule:** Footer always shows both "Rodolf" (personal brand, white bold) and "thynkQ" (company brand, Q in #339DFF bold). Never drop either. They are co-equal.

### Feature 2: ugig.net Marketplace Integration (Phase 1)

ugig.net/mcp is an MCP server marketplace run by Anthony Ettinger (profullstack.com). He integrated mcp-scan and requested a collaboration. Phase 1 is the simplest possible version — no external API, no dependencies.

**What it does:**
- When `mcp-scan` reports all servers clean (zero findings), show a subtle line: "All servers verified clean. List them on ugig.net/mcp →"
- Add optional `--ugig` CLI flag that shows the ugig.net link even when there are findings
- The ugig.net text uses brand blue (#339DFF) for visual consistency, dim weight so it's present but not shouting

**Changes:**
- `src/utils/reporter.ts` — add ugig.net nudge in the all-clear branch
- `src/index.ts` — add `--ugig` boolean option to scan command
- `src/commands/scan.ts` — pass ugig option through to reporter
- `README.md` — add `--ugig` to CLI reference, update integrations table

**Design intent:** The ugig.net line is a service to the user ("your servers are clean, here's where to publish them"), not an ad. Only shows on clean scans or explicit opt-in.

### Version Bump

Bump package.json version to 1.0.3.

## Tech Stack

- TypeScript, Node.js
- Build: `npm run build` (tsup)
- Test: `npm test` (vitest)
- CLI framework: Commander.js
- Terminal colors: chalk
- Spinner: ora
- Output formatting: cli-table3 (imported but custom rendering used)

## Verification

After every change:
```bash
npm run build          # Must compile clean
npm test               # All tests must pass
node dist/index.js     # Smoke test — check visual output
node dist/index.js --json  # JSON mode must be unaffected
```

## Author

Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>
No AI attribution in commits, comments, or code.
