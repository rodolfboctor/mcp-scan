# mcp-scan — Gemini Autonomous Build

## START IMMEDIATELY — NO USER INPUT NEEDED

You are running in **fully autonomous mode**. Do not ask questions. Do not use Ask User. Do not stop for confirmation. Answer all decisions yourself using the project context in this file.

**Your task:** Build mcp-scan v2.0 — Acquisition Readiness. 5 phases. Full GSD workflow per phase. Start now.

---

## ZERO-INPUT RULE

**NEVER call Ask User.** If a GSD workflow prompts you for input, answer it yourself from the context in this file. Every question has an answer here. If you truly cannot find an answer, make a reasonable decision and document it — do not pause.

---

## HOW GSD WORKS IN GEMINI

You cannot invoke `/gsd:` slash commands. Read the workflow `.md` file directly and follow its steps.

```bash
cat ~/.gemini/get-shit-done/workflows/<workflow-name>.md
node "$HOME/.gemini/get-shit-done/bin/gsd-tools.cjs" init <workflow-type>
```

Workflows: `discuss-phase.md`, `plan-phase.md`, `execute-phase.md`, `verify-work.md`, `session-report.md`

---

## PROJECT STATE

- **Current version:** v1.0.4 (config dedup fix, 47 tests passing)
- **Active milestone:** v2.0 — Acquisition Readiness
- **Phases to build:** 3, 4, 5, 6, 7
- **Project root:** `/Users/rodolf/Documents/Code/mcp-scan`
- **Branch:** main

---

## THE 5 PHASES — Pre-answered decisions for every workflow prompt

### Phase 3: Coverage Breadth

**Goal:** Detect more tools than any competitor.

**What to build:**
- Add to `src/config/paths.ts`: Zed (`~/.config/zed/settings.json`), Continue.dev (`~/.continue/config.json`), Cline (glob: `~/.vscode/extensions/saoudrizwan.claude-dev*/settings.json`), Roo Code (glob: `~/.vscode/extensions/rooveterinaryinc.roo-cline*/settings.json`), Amp (`~/.amp/config.json`), Plandex (`~/.plandex/config.json`), ChatGPT Desktop (macOS: `~/Library/Application Support/com.openai.chat/settings.json`), GitHub Copilot (`~/.config/github-copilot/apps.json`)
- Add `.mcp.json` detection in cwd (format: `{ "mcpServers": { ... } }`)
- Add `--ci` flag using `process.exitCode = 1` (NOT `process.exit(1)`). Read `src/index.ts` first.

**Version bump:** 1.0.4 → 1.1.0
**Commit:** `feat(paths): add 8 new AI tool config paths, .mcp.json support, --ci flag`

---

### Phase 4: Scanner Depth

**Prompt injection scanner** (`src/scanners/prompt-injection-scanner.ts`):
- Strings: "ignore previous instructions", "ignore all prior", "you are now", "disregard", "forget your instructions", "override your"
- Unicode: U+200B, U+FEFF, U+202E, U+00AD
- Base64 > 50 chars: `/[A-Za-z0-9+/]{50,}={0,2}/`
- Tool names: `bash`, `python`, `eval`, `exec`, `shell`, `terminal`, `run`, `system`
- `additionalProperties: true` at schema root
- IDs: `prompt-injection-pattern` (HIGH), `unicode-injection` (HIGH), `tool-name-shadow` (MEDIUM), `schema-bypass-risk` (LOW)

**OSV.dev scanner** (add to `src/scanners/package-scanner.ts`):
- POST `https://api.osv.dev/v1/query` with `{"package":{"name":"<pkg>","ecosystem":"npm"}}`
- 5s timeout via AbortController, fail silently — NEVER crash
- CVSS >= 9.0 → `known-vulnerability-critical` (CRITICAL), >= 7.0 → `known-vulnerability-high` (HIGH)

**.env leak scanner** (`src/scanners/env-leak-scanner.ts`):
- Check parent dirs of server file paths for `.env` files
- Detect keys matching `*_KEY|*_SECRET|*_TOKEN|*_PASSWORD|API_*|AUTH_*` with values > 20 chars
- Skip values containing `YOUR_`, `REPLACE`, `EXAMPLE`, `PLACEHOLDER`
- `env-secret-exposed` (HIGH) — KEY NAME ONLY, never the value

**Version bump:** 1.1.0 → 1.2.0
**Commit:** `feat(scanners): add prompt injection, OSV.dev CVE, and env leak scanners`

---

### Phase 5: npm Library Export

**What to build:**
- `src/lib.ts` exports: `runScan`, `detectTools`, types `ScanReport`, `ServerScanResult`, `Finding`, `ScanOptions`
- No Commander/chalk/ora in lib.ts — zero console output
- tsup builds `dist/lib.js` (ESM) and `dist/lib.cjs` (CJS)
- Add `exports` field to package.json
- Add Programmatic Usage to README.md

**Verify with:**
```bash
node -e "const {runScan}=require('./dist/lib.cjs'); console.log('CJS OK:', typeof runScan)"
```

**Version bump:** 1.2.0 → 1.3.0
**Commit:** `feat(lib): export public API as importable npm library`

---

### Phase 6: GitHub Action + SARIF

**CRITICAL: `action.yml` MUST be at REPO ROOT (same level as package.json). NOT inside any subdirectory.**

- `src/utils/sarif-reporter.ts` — SARIF 2.1.0. CRITICAL/HIGH → "error", MEDIUM → "warning", LOW/INFO → "note"
- `--sarif [file]` CLI flag (read `src/index.ts` first)
- `action/src/action.ts` imports `runScan` from `../../src/lib.js`
- `action.yml` at REPO ROOT:
```yaml
name: 'mcp-scan'
description: 'Security scanner for MCP server configurations'
author: 'ThynkQ'
branding:
  icon: 'shield'
  color: 'blue'
inputs:
  config:
    description: 'Path to specific MCP config file'
    required: false
    default: ''
  severity:
    description: 'Minimum severity threshold (critical|high|medium|low|info)'
    required: false
    default: 'high'
  fail-on-findings:
    description: 'Exit with code 1 if findings exist at or above threshold'
    required: false
    default: 'true'
  sarif-output:
    description: 'Path for SARIF report output'
    required: false
    default: 'mcp-scan-results.sarif'
outputs:
  findings-count:
    description: 'Total findings'
  critical-count:
    description: 'Critical findings'
  sarif-path:
    description: 'Path to SARIF file'
runs:
  using: 'node20'
  main: 'action/dist/action.js'
```
- `package.json` script: `"build:action": "tsup action/src/action.ts --outDir action/dist --format cjs --target node20 --no-dts"`
- `.github/workflows/mcp-scan-example.yml`
- If `@actions/core` not in package.json: `npm install --save-dev @actions/core`

**Version bump:** 1.3.0 → 1.4.0
**Commit:** `feat(action): add GitHub Action with SARIF output for CI/CD integration`

---

### Phase 7: Community Health

**CONTRIBUTING.md** (max 150 lines): what it does, setup, how to add tool/scanner, commit style, PR requirements.

**SECURITY.md:** email rodolf@thynkq.com, 48h response, advisory ID format `MCP-SCAN-YYYY-NNN`.

**CHANGELOG.md** (read `git log --oneline` first, keepachangelog.com format): entries v1.0.3 through v1.5.0.

**.pre-commit-hooks.yaml:**
```yaml
- id: mcp-scan
  name: MCP Security Scan
  description: Scans MCP server configurations for security issues
  language: node
  entry: mcp-scan
  args: ['--ci', '--severity', 'high']
  pass_filenames: false
```

**--help examples:** Read `src/index.ts`, add `.addHelpText('after', ...)` with 5 real examples.

**Version bump:** 1.4.0 → 1.5.0
**Commit:** `feat(community): add CONTRIBUTING, SECURITY, CHANGELOG, pre-commit hooks`

---

## EXECUTION SEQUENCE

```
1. Read .planning/STATE.md, .planning/ROADMAP.md
2. Phase 3: cat discuss-phase.md workflow → follow (use answers above) → plan → execute → npm run build && npm test → verify → commit
3. Phase 4: same flow
4. Phase 5: same flow
5. Phase 6: same flow — verify action.yml is at repo root
6. Phase 7: same flow
7. npm run build && npm run build:action && npm test -- --reporter=verbose
8. git push origin main
9. cat ~/.gemini/get-shit-done/workflows/session-report.md → follow it
```

---

## GUARDRAILS

- NEVER call Ask User
- NEVER use /gsd:quick
- NEVER add AI attribution to any commit, comment, or file
- NEVER edit a file without reading it first
- NEVER run `npm publish`
- ALWAYS `npm run build && npm test` before committing
- OSV.dev failures must be silent — never crash the scan
- .env scanner: KEY NAME ONLY, never secret values
- `process.exitCode = 1` not `process.exit(1)`
- Version sequence: 1.0.4 → 1.1.0 → 1.2.0 → 1.3.0 → 1.4.0 → 1.5.0

---

## PROJECT DETAILS

| Key | Value |
|-----|-------|
| Language | TypeScript |
| Build | `npm run build` (tsup) |
| Test | `npm test` (vitest) |
| Entry | `src/index.ts` (Commander.js) |
| Config paths | `src/config/paths.ts` |
| Scan logic | `src/commands/scan.ts` |
| Scanners dir | `src/scanners/` |
| Author | Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com> |

## Brand Colors
```
#339DFF  ThynkQ blue | #F85149  Critical | #F0883E  High | #3FB950  Pass
```

## Attribution
Footer: `by Rodolf · thynkQ  thynkq.com`
