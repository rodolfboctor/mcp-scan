# mcp-scan — Gemini CLI Instructions

## ⚠️ LAUNCH FROM PROJECT DIRECTORY

Always launch Gemini from the mcp-scan project root:
```bash
cd /Users/rodolf/Documents/Code/mcp-scan
gemini
```

**If you see GSD command conflict warnings at startup** (commands renamed to `/workspace.gsd:*` and `/user.gsd:*`): you launched from `~`. Exit and relaunch from the project directory. The conflicts are gone when cwd is not `~`.

---

## CRITICAL: How GSD Works in Gemini

You CANNOT invoke `/gsd:` slash commands. They only fire when the USER types them at the prompt. Instead, READ the workflow `.md` file directly and follow its `<process>` steps exactly.

```bash
# Pattern: read workflow, follow its steps
cat ~/.gemini/get-shit-done/workflows/<workflow-name>.md
```

Use the GSD tools binary when workflows reference it:
```bash
node "$HOME/.gemini/get-shit-done/bin/gsd-tools.cjs" init <workflow-type>
```

---

## CURRENT TASK: v2.0 Acquisition Readiness Build

v1.0.4 is shipped (config dedup bug fixed, 47 tests passing). The next milestone is **v2.0 — Acquisition Readiness**.

### Context

mcp-scan is a CLI security scanner for MCP (Model Context Protocol) server configs. The acquisition play: OSS reputation + community signals, targeting Snyk, Wiz, or GitHub within 12-18 months. Snyk already acquired Invariant Labs (original mcp-scan creators) in June 2025. Window is closing.

**Current state:** v1.0.4, detects 8 tools, 8 scanners. Needs: more tool coverage, deeper scanners, GitHub Action with SARIF, npm library export, community health files.

### What to build (5 phases)

1. **Coverage Breadth** — Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, GitHub Copilot. .mcp.json support. --ci flag.
2. **Scanner Depth** — Prompt injection scanner, OSV.dev CVE lookup, .env leak scanner.
3. **Library Export** — `src/lib.ts` public API, ESM + CJS builds. MUST come before Phase 4.
4. **GitHub Action + SARIF** — `action.yml` AT REPO ROOT (not in a subdirectory). SARIF 2.1.0 for GitHub Security tab. action/src/action.ts imports from `../../src/lib.ts`.
5. **Community Health** — CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, pre-commit hooks.

### How to start the v2.0 build

The full autonomous command is at `.claude/commands/build-mcp-scan.md`. Send that to Claude Code. Gemini handles individual phases as Claude directs.

For a standalone Gemini execution, follow the GSD full flow:
```
Step 1: Read .planning/STATE.md and .planning/ROADMAP.md
Step 2: cat ~/.gemini/get-shit-done/workflows/new-milestone.md — follow process
Step 3: For each phase: cat ~/.gemini/get-shit-done/workflows/discuss-phase.md, then plan-phase.md, then execute-phase.md, then verify-work.md
```

DO NOT use /gsd:quick. Use the full discuss→plan→execute→verify loop for every phase.

---

## Project Details

| Key | Value |
|-----|-------|
| Language | TypeScript |
| Build | `npm run build` (tsup) |
| Test | `npm test` (vitest) |
| Lint | `npm run lint` |
| Entry | `src/index.ts` (Commander.js) |
| Main output file | `src/utils/reporter.ts` |
| Config detector | `src/config/detector.ts` |
| Config paths | `src/config/paths.ts` |
| Scan logic | `src/commands/scan.ts` |
| Author | Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com> |
| No AI attribution | In commits, comments, or code |

## Brand Colors

```
#339DFF  — ThynkQ blue (brand, Q logo, borders, accents)
#F85149  — Critical red
#F0883E  — High orange
#D29922  — Medium yellow
#3FB950  — Pass green
#8B949E  — Accent gray (secondary text, separators)
```

## Attribution

Footer always shows both brands together:
```
by Rodolf · thynkQ  thynkq.com
```
- "Rodolf" = chalk.white.bold (personal brand)
- "thynk" = dim, "Q" = chalk.hex('#339DFF').bold
- Never drop either name

## Security Data Rule

Research-first. Never fabricate regex patterns, package lists, or threat intel. Verify against official docs. If unsure, add a TODO instead of guessing.

## Critical guardrails

- `action.yml` must be at REPO ROOT for `uses: rodolfboctor/mcp-scan@v1` to work
- Library Export (Phase 3) MUST be done before GitHub Action (Phase 4) — the Action imports from the library
- Use `process.exitCode = 1` not `process.exit(1)` for --ci flag so tests can verify behavior
- `import path from 'path'` (not `* as path`) in TypeScript

## Verification (after every change)

```bash
npm run build
npm test
node dist/index.js
node dist/index.js --json
```

## Reference Files

- `.claude/commands/build-mcp-scan.md` — Full autonomous build command (30 GSD invocations)
- `.planning/STATE.md` — GSD state tracking
- `.planning/ROADMAP.md` — Phase breakdown
- `TASKS-DEDUP-FIX.md` — v1.0.4 fix spec (DONE)
- `.planning/codebase/` — Codebase map
