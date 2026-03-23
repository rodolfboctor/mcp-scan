# /build-mcp-scan — Autonomous Build to Acquisition Readiness

You are executing a fully autonomous, multi-phase build of mcp-scan toward acquisition readiness.
DO NOT ask questions. DO NOT stop for confirmation. If something fails twice, skip and report at the end.
NEVER use /gsd:quick for any task. Use the full GSD workflow at every step.

---

## ⚠️ GEMINI CLI SETUP — CRITICAL BEFORE STARTING

**Run Gemini from the mcp-scan project directory:**
```bash
cd /Users/rodolf/Documents/Code/mcp-scan
gemini
```

**If Gemini shows GSD command conflicts at startup** (commands renamed to `/workspace.gsd:*` and `/user.gsd:*`), you launched Gemini from the wrong directory (likely `~`). This happens because `~/.gemini/commands/` gets loaded as both "user" and "workspace" when the cwd is home.

**Fix:** Exit, `cd` to the project directory, relaunch. The conflicts will be gone.

**GSD command syntax:** All `/gsd:*` commands in this file are typed by the USER at the Gemini prompt. Gemini itself reads the workflow `.md` file directly — it cannot invoke slash commands autonomously. Instruct Gemini to: `cat ~/.gemini/get-shit-done/workflows/<workflow-name>.md` and follow the `<process>` steps.

---

## BEFORE ANYTHING — Read the actual project state

```bash
cat package.json
cat .planning/STATE.md
cat .planning/ROADMAP.md
cat .planning/PROJECT.md
cat src/config/paths.ts
ls src/scanners/
git log --oneline -10
git status
```

Do NOT proceed until you have read every file above. Never assume what version the code is at or what is already implemented.

---

## STEP 1 — Map the codebase

```
/gsd:map-codebase
```

Read the output. Understand every file and what it does before touching anything.

---

## STEP 2 — Create the v2.0 milestone

```
/gsd:new-milestone
```

When prompted, use these inputs:
- **Milestone name:** v2.0 — Acquisition Readiness
- **Goal:** Make mcp-scan the undisputed authority on MCP security. Best coverage, deepest scanners, GitHub Action with SARIF, npm library export, full community health files. Target: acquisition by Snyk, Wiz, or GitHub within 12-18 months.
- **Context:** Current state is v1.0.4 (CLI-only, 7 tools detected, 8 scanners). Competitors: Snyk Agent Scan (backed by $407M revenue co), Proximity (VC-backed), Ramparts (VC-backed), mcpscan.ai. Window is 12-18 months before big players dominate. Strategy: OSS reputation + acquisition, not SaaS. Key signals that attract acquirers: GitHub stars, security advisories published, CI/CD integration used in real pipelines, importable library.

---

## STEP 3 — Research competitors before adding phases

```
/gsd:research-phase
```

When prompted for phase context, say: "Research phase for v2.0. Need to know: (1) What config paths do Zed, Continue.dev, Cline, Roo Code, Amp, Plandex use for MCP — verify from official docs or GitHub repos, never guess. (2) What does OSV.dev API expect for npm package vulnerability lookups. (3) What SARIF 2.1.0 schema fields are required for GitHub Security tab integration. (4) What do Snyk Agent Scan and Proximity detect that mcp-scan does NOT detect right now. (5) What is the official Anthropic .mcp.json project-root spec format."

Write findings to `RESEARCH-V2.md` in the project root.

---

## STEP 4 — Add all phases to the milestone

Run each of these in sequence. Wait for each to complete before running the next.

```
/gsd:add-phase
```
Phase 1 inputs:
- **Name:** Coverage Breadth
- **Goal:** Detect more tools than any competitor. Add 8+ new AI tool config paths. Add .mcp.json project-root support. Add --ci flag for CI/CD exit codes.
- **Success criteria:** mcp-scan detects Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, GitHub Copilot. `--ci` flag exits 1 on findings, 0 on clean. All existing tests pass. Build clean.

```
/gsd:add-phase
```
Phase 2 inputs:
- **Name:** Scanner Depth
- **Goal:** Find real security issues competitors miss. Add prompt injection scanner, OSV.dev CVE lookup, .env leak scanner, and protocol abuse scanner.
- **Success criteria:** Prompt injection patterns detected in tool descriptions. OSV.dev API queried for npm packages — real CVEs surfaced as CRITICAL/HIGH findings. .env files with secrets in server working directories flagged. All new scanners have tests. Build clean.

```
/gsd:add-phase
```
Phase 3 inputs:
- **Name:** npm Library Export
- **Goal:** Allow other tools to `import { runScan } from 'mcp-scan'` without CLI. Makes mcp-scan acquirable as a drop-in library. MUST be done BEFORE the GitHub Action phase so the Action can import from the library.
- **Success criteria:** `src/lib.ts` exports public API. package.json has `exports` field for both ESM and CJS. `node -e "const {runScan}=require('./dist/lib.cjs')"` works. README has Programmatic Usage section.

```
/gsd:add-phase
```
Phase 4 inputs:
- **Name:** GitHub Action + SARIF
- **Goal:** Let developers add mcp-scan to any CI pipeline in one step. Build GitHub Action with SARIF output that feeds into GitHub Security tab. IMPORTANT: action.yml MUST be at the REPOSITORY ROOT (not inside action/), because GitHub resolves `uses: rodolfboctor/mcp-scan@v1` from the repo root.
- **Success criteria:** `action.yml` exists AT THE REPO ROOT. `action/dist/action.js` exists as the compiled entry point. SARIF 2.1.0 output validates against schema. `--sarif` CLI flag works. Example workflow file exists at `.github/workflows/mcp-scan-example.yml`. Build clean.

```
/gsd:add-phase
```
Phase 5 inputs:
- **Name:** Community Health + Developer Experience
- **Goal:** Make mcp-scan look like a serious, maintained open source project. Add CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, pre-commit hooks, better --help.
- **Success criteria:** All 4 files exist and are substantive (not stubs). `.pre-commit-hooks.yaml` works. `node dist/index.js --help` shows examples. CHANGELOG covers all releases back to v1.0.3.

---

## STEP 5 — Execute Phase 1: Coverage Breadth

### 5a. Discuss the phase

```
/gsd:discuss-phase
```
Select Phase 1: Coverage Breadth. Answer all questions using findings from RESEARCH-V2.md. The key decisions: which config paths are verified correct for each tool, whether to use glob patterns for extension-based paths (Cline/Roo Code paths vary by install), how to handle the .mcp.json spec format.

### 5b. Plan the phase

```
/gsd:plan-phase
```
Select Phase 1. The plan must include:
- Read `src/config/paths.ts` in full before writing any changes
- For each new tool: exact macOS path, exact Windows path, exact Linux path (all verified from RESEARCH-V2.md)
- Whether the parser in `src/config/parser.ts` already handles each tool's format
- Separate task for `--ci` flag: read `src/index.ts` first, then add the option. Use `process.exitCode = 1` (NOT `process.exit(1)`) so the process exits gracefully and tests can verify behavior
- Verification: `npm run build && npm test` after changes

### 5c. Execute the phase

```
/gsd:execute-phase
```
Select Phase 1. Follow the plan exactly. Read every file before editing. Do not add config paths that were not verified in RESEARCH-V2.md. After execution:

```bash
npm run build
npm test
node dist/index.js
node dist/index.js --ci; echo "exit code: $?"
```

All tests must pass. Build must be clean.

### 5d. Verify the phase

```
/gsd:verify-work
```
Select Phase 1. Verification checklist that must all pass:
- [ ] New tool paths exist in `src/config/paths.ts` for all 3 platforms
- [ ] `.mcp.json` project-root detection works
- [ ] `--ci` flag exits 1 when findings exist, 0 when clean
- [ ] `npm run build` clean
- [ ] `npm test` all pass (number of tests must be >= previous count)
- [ ] `node dist/index.js` runs without crashing

### 5e. Commit Phase 1

```bash
git config user.name "Abanoub Rodolf Boctor"
git config user.email "abanoub.rodolf@gmail.com"
```

Read `package.json` to confirm current version. Bump to `1.1.0`. Then commit:

```bash
git add src/config/paths.ts src/config/detector.ts src/config/parser.ts src/index.ts package.json tests/
git commit -m "feat(paths): add 8 new AI tool config paths and --ci flag for v1.1

Add Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop,
and GitHub Copilot to tool detection. Add --ci flag for CI/CD mode
(exit 1 on findings, 0 on clean). Add .mcp.json project-root support."
```

NEVER include "Co-authored-by", "Generated by", or any AI attribution.

---

## STEP 6 — Execute Phase 2: Scanner Depth

### 6a. Discuss the phase

```
/gsd:discuss-phase
```
Select Phase 2: Scanner Depth. Key decisions to lock in: (1) How to call OSV.dev API — use `fetch` or `https` module? Timeout strategy? (2) What Unicode code points are the highest-signal for injection attempts? (3) For .env leak scanner — do we read the .env file contents or just detect its existence?

### 6b. Plan the phase

```
/gsd:plan-phase
```
Select Phase 2. The plan must include:
- Read `src/scanners/config-scanner.ts` and `src/scanners/secret-scanner.ts` as patterns to follow
- Separate task for each scanner: prompt injection, OSV.dev CVE, .env leak
- Integration task: read `src/commands/scan.ts` fully before adding new scanner calls
- Test task: read `tests/scanners/secret-scanner.test.ts` as test pattern, write tests for each new scanner
- OSV.dev must fail gracefully (timeout = 5s, catch all errors, never crash scan)
- .env leak scanner must NEVER log actual secret values, only detect presence

### 6c. Execute the phase

```
/gsd:execute-phase
```
Select Phase 2. Follow the plan exactly.

**Prompt injection scanner** (`src/scanners/prompt-injection-scanner.ts`) — detect:
- Strings in tool `description` fields: "ignore previous instructions", "ignore all prior", "you are now", "disregard", "forget your instructions", "override your"
- Hidden Unicode: U+200B (zero-width space), U+FEFF (BOM), U+202E (right-to-left override), U+00AD (soft hyphen)
- Base64 strings > 50 chars embedded in descriptions (regex: `[A-Za-z0-9+/]{50,}={0,2}`)
- Tool names exactly matching: `bash`, `python`, `eval`, `exec`, `shell`, `terminal`, `run`, `system`
- Tool schemas with `additionalProperties: true` at root
- Finding IDs: `prompt-injection-pattern` (HIGH), `unicode-injection` (HIGH), `tool-name-shadow` (MEDIUM), `schema-bypass-risk` (LOW)

**OSV.dev scanner** (add to `src/scanners/package-scanner.ts`) — for each npm package:
- POST to `https://api.osv.dev/v1/query` with `{"package":{"name":"<pkg>","ecosystem":"npm"}}`
- 5 second timeout, catch all network errors silently
- If CVSS >= 9.0: finding `known-vulnerability-critical` (CRITICAL)
- If CVSS >= 7.0: finding `known-vulnerability-high` (HIGH)
- Cache results by package name within the same scan run

**.env leak scanner** (`src/scanners/env-leak-scanner.ts`) — for each server:
- Extract file paths from `args` array
- Check parent directory for `.env` files
- If `.env` found in a git repo: read line by line, detect keys matching `*_KEY|*_SECRET|*_TOKEN|*_PASSWORD|API_*|AUTH_*` with values > 20 chars that don't contain `YOUR_|REPLACE|EXAMPLE|PLACEHOLDER`
- Finding: `env-secret-exposed` (HIGH) — report KEY NAME only, NEVER the value

After writing all scanners, run:
```bash
npm run build
npm test
node dist/index.js --verbose
```

### 6d. Verify the phase

```
/gsd:verify-work
```
Select Phase 2. Verification checklist:
- [ ] `src/scanners/prompt-injection-scanner.ts` exists and is integrated in `scan.ts`
- [ ] OSV.dev call is in package-scanner.ts with timeout and error handling
- [ ] `src/scanners/env-leak-scanner.ts` exists and never logs secret values
- [ ] Tests exist for all 3 new scanners
- [ ] `npm run build` clean
- [ ] `npm test` all pass

### 6e. Commit Phase 2

Bump to `1.2.0`. Commit:

```
feat(scanners): add prompt injection, OSV.dev CVE, and env leak scanners

Detect prompt injection patterns and Unicode tricks in tool descriptions,
query OSV.dev for known CVEs in npm packages, detect exposed .env secrets
in server working directories. 3 new scanners, 3 new test files.
```

---

## STEP 7 — Execute Phase 3: npm Library Export

**This MUST come before the GitHub Action phase. The Action imports from the library.**

### 7a. Discuss the phase

```
/gsd:discuss-phase
```
Select Phase 3: npm Library Export. Key decisions: (1) Should `runScan({ silent: true })` suppress ALL output including the spinner? YES — library consumers must get zero console output. (2) What types need to be exported for consumers? At minimum: `ScanReport`, `ServerScanResult`, `Finding` types. (3) Should the library re-export `detectTools`? YES — useful for tools that just want to discover configs without scanning.

### 7b. Plan the phase

```
/gsd:plan-phase
```
Select Phase 3. The plan must include:
- Read `src/commands/scan.ts` to verify `silent` option suppresses all output
- Create `src/lib.ts` exporting only public API (no Commander, no chalk, no ora)
- Update tsup config to build `src/lib.ts` as both ESM and CJS
- Update `package.json` exports field
- Verify with `node -e` test

### 7c. Execute the phase

```
/gsd:execute-phase
```
Select Phase 3. After execution:

```bash
npm run build
npm test
node -e "const {runScan}=require('./dist/lib.cjs'); console.log('CJS import OK:', typeof runScan)"
node --input-type=module <<'EOF'
import { runScan } from './dist/lib.js';
console.log('ESM import OK:', typeof runScan);
EOF
```

Both import tests must succeed.

### 7d. Verify the phase

```
/gsd:verify-work
```
Select Phase 3. Checklist:
- [ ] `src/lib.ts` exists and exports `runScan`, relevant types
- [ ] `dist/lib.js` and `dist/lib.cjs` both exist after build
- [ ] CJS import works: `node -e "require('./dist/lib.cjs')"`
- [ ] README has Programmatic Usage section with TypeScript example
- [ ] `npm test` all pass

### 7e. Commit Phase 3

Bump to `1.3.0`. Commit:

```
feat(lib): export public API as importable npm library

Add src/lib.ts as library entry point. Build both ESM and CJS formats.
Security platforms can now import {runScan} from 'mcp-scan' without
invoking the CLI binary.
```

---

## STEP 8 — Execute Phase 4: GitHub Action + SARIF

**IMPORTANT: action.yml MUST live at the REPOSITORY ROOT, not inside action/. GitHub resolves `uses: user/repo@v1` from the repo root.**

### 8a. Discuss the phase

```
/gsd:discuss-phase
```
Select Phase 4: GitHub Action + SARIF. Key decisions: (1) The action imports `runScan` from `src/lib.ts` (built in Phase 3). Verify the import works. (2) SARIF schema: which fields are mandatory for GitHub Security tab? (3) Where does action.yml go? AT THE REPO ROOT. The compiled action entry point goes in `action/dist/action.js`, but action.yml must be at the root.

### 8b. Plan the phase

```
/gsd:plan-phase
```
Select Phase 4. The plan must include:
- SARIF reporter task: create `src/utils/sarif-reporter.ts` mapping ScanReport to SARIF 2.1.0
- CLI task: add `--sarif [file]` option to `src/index.ts`
- Action entry point task: create `action/src/action.ts` (imports from `../../src/lib.ts`)
- action.yml task: create `action.yml` AT THE REPO ROOT (not inside action/)
- Build task: add `build:action` script to package.json
- Example workflow task: create `.github/workflows/mcp-scan-example.yml`
- Verify SARIF schema compliance

### 8c. Execute the phase

```
/gsd:execute-phase
```
Select Phase 4.

**SARIF Reporter** (`src/utils/sarif-reporter.ts`):

```typescript
// Must produce valid SARIF 2.1.0
// Schema: https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json
// Required fields: $schema, version, runs[].tool.driver.name, runs[].results[]
// Severity mapping: CRITICAL/HIGH → "error", MEDIUM → "warning", LOW/INFO → "note"
// Each result needs: ruleId, message.text, level, locations[].physicalLocation.artifactLocation.uri
```

**action.yml** — MUST be at the REPOSITORY ROOT (same level as package.json). Use this exact YAML:
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

**action/src/action.ts** — check if `@actions/core` is in package.json first. If not: `npm install --save-dev @actions/core`. The action must:
1. Read inputs with `core.getInput()`
2. Import `runScan` from `../../src/lib.js` (the library export from Phase 3)
3. Call `runScan({ silent: true, ...options })` to get ScanReport
4. Write SARIF via `writeSarifReport(report, sarifPath)`
5. Set outputs with `core.setOutput()`
6. Call `core.setFailed()` if findings at threshold and `fail-on-findings` is true

Add to package.json scripts (read current scripts first, do not overwrite):
```json
"build:action": "tsup action/src/action.ts --outDir action/dist --format cjs --target node20 --no-dts"
```

Run:
```bash
npm install
npm run build
npm run build:action
npm test
node dist/index.js --sarif /tmp/test-output.sarif
cat /tmp/test-output.sarif | python3 -c "import sys,json; d=json.load(sys.stdin); print('SARIF OK, results:', sum(len(r['results']) for r in d['runs']))"
ls -la action/dist/action.js
ls action.yml && echo "action.yml at repo root: OK"
```

### 8d. Verify the phase

```
/gsd:verify-work
```
Select Phase 4. Verification checklist:
- [ ] `action.yml` exists AT THE REPO ROOT (same directory as package.json)
- [ ] `action/dist/action.js` exists and is non-empty
- [ ] `node dist/index.js --sarif /tmp/x.sarif` produces valid JSON with `$schema` field
- [ ] `.github/workflows/mcp-scan-example.yml` exists
- [ ] `npm run build` clean
- [ ] `npm test` all pass

### 8e. Commit Phase 4

Bump to `1.4.0`. Commit:

```
feat(action): add GitHub Action with SARIF output for CI/CD integration

Add GitHub Action at repo root. Developers can add mcp-scan to any
CI workflow with one step. SARIF output feeds into GitHub Security tab,
showing findings inline in PRs. Add --sarif CLI flag.
```

---

## STEP 9 — Execute Phase 5: Community Health

### 9a. Discuss the phase

```
/gsd:discuss-phase
```
Select Phase 5. Key decisions: (1) Read existing README.md to avoid duplicating content. (2) What contact email is used in the project — read it from README or package.json. (3) What version should `.pre-commit-hooks.yaml` reference?

### 9b. Plan the phase

```
/gsd:plan-phase
```
Select Phase 5. Plan must include reading README.md, package.json, and any existing docs before writing any files.

### 9c. Execute the phase

```
/gsd:execute-phase
```
Select Phase 5.

**CONTRIBUTING.md** — write for a developer who has never seen this repo:
1. What the project does (one sentence)
2. How to set up locally (clone, npm install, npm run build, npm test)
3. How to add a new tool (3 specific steps with file names)
4. How to add a new scanner (follow `src/scanners/config-scanner.ts` pattern)
5. Commit style: conventional commits, no AI attribution, specific messages
6. PR requirements: tests pass, build clean, CHANGELOG entry

Max 150 lines. No fluff.

**SECURITY.md** — read README.md first for contact info. Include:
- How to report vulnerabilities in mcp-scan itself
- Contact email (read from README or package.json)
- 48-hour response commitment
- Advisory ID format: `MCP-SCAN-YYYY-NNN`

**CHANGELOG.md** — read `git log --oneline` first. Write entries for:
- v1.5.0 — Community health files
- v1.4.0 — npm library export
- v1.3.0 — GitHub Action + SARIF
- v1.2.0 — Prompt injection, OSV.dev, env leak scanners
- v1.1.0 — 8 new tool paths, --ci flag
- v1.0.4 — Config dedup fix
- v1.0.3 — Visual upgrade, ugig.net integration

Format: https://keepachangelog.com/ standard.

**.pre-commit-hooks.yaml** in project root:
```yaml
- id: mcp-scan
  name: MCP Security Scan
  description: Scans MCP server configurations for security issues
  language: node
  entry: mcp-scan
  args: ['--ci', '--severity', 'high']
  pass_filenames: false
```

**--help examples** — read `src/index.ts` first. Add `.addHelpText('after', ...)` with 5 real usage examples.

After all files created:
```bash
npm run build
npm test
node dist/index.js --help
ls CONTRIBUTING.md SECURITY.md CHANGELOG.md .pre-commit-hooks.yaml
```

### 9d. Verify the phase

```
/gsd:verify-work
```
Select Phase 5. Checklist:
- [ ] `CONTRIBUTING.md` exists, > 30 lines, covers setup + how to add tool/scanner
- [ ] `SECURITY.md` exists with contact and advisory format
- [ ] `CHANGELOG.md` exists with entries from v1.0.3 through v1.5.0
- [ ] `.pre-commit-hooks.yaml` exists
- [ ] `node dist/index.js --help` shows Examples section
- [ ] `npm test` all pass

### 9e. Commit Phase 5

Bump to `1.5.0`. Commit:

```
feat(community): add CONTRIBUTING, SECURITY, CHANGELOG, pre-commit hooks

Add open source community health files. Add pre-commit hook support.
Improve --help with usage examples. Project now meets GitHub community
standards for a maintained open source tool.
```

---

## STEP 10 — Audit the milestone

```
/gsd:audit-milestone
```

This verifies that all 5 phases delivered what they promised against the v2.0 milestone goal. Read the output. If gaps are found, create tasks to close them.

---

## STEP 11 — Final build, full verification

Run this exact sequence. Do not skip any step:

```bash
npm run build
npm run build:action
npm test -- --reporter=verbose
node dist/index.js
node dist/index.js --ci; echo "--ci exit code: $?"
node dist/index.js --json | python3 -m json.tool > /dev/null && echo "JSON: valid"
node dist/index.js --sarif /tmp/final.sarif && python3 -c "import json; d=json.load(open('/tmp/final.sarif')); print('SARIF: valid,', len(d['runs'][0]['results']), 'results')"
node -e "const {runScan}=require('./dist/lib.cjs'); console.log('Library CJS: OK')"
ls -la action/dist/action.js && echo "Action bundle: OK"
ls CONTRIBUTING.md SECURITY.md CHANGELOG.md .pre-commit-hooks.yaml && echo "Community files: OK"
cd ~ && node /Users/rodolf/Documents/Code/mcp-scan/dist/index.js 2>&1 | tail -5
cd /Users/rodolf/Documents/Code/mcp-scan
git log --oneline -10
```

Every line must succeed without errors. If anything fails, fix it before proceeding.

---

## STEP 12 — Push everything

```bash
git config user.name "Abanoub Rodolf Boctor"
git config user.email "abanoub.rodolf@gmail.com"
git status
git push origin main
```

---

## STEP 13 — Session report

```
/gsd:session-report
```

This generates the final summary of all work completed.

Then output a plain-text report in this format:

```
=== mcp-scan v2.0 Build Report ===

Phases completed:
  Phase 1 — Coverage Breadth (v1.1.0): [PASS/FAIL]
  Phase 2 — Scanner Depth (v1.2.0): [PASS/FAIL]
  Phase 3 — Library Export (v1.3.0): [PASS/FAIL]
  Phase 4 — GitHub Action + SARIF (v1.4.0): [PASS/FAIL]
  Phase 5 — Community Health (v1.5.0): [PASS/FAIL]

GSD commands used:
  /gsd:map-codebase
  /gsd:new-milestone
  /gsd:research-phase
  /gsd:add-phase (x5)
  /gsd:discuss-phase (x5)
  /gsd:plan-phase (x5)
  /gsd:execute-phase (x5)
  /gsd:verify-work (x5)
  /gsd:audit-milestone
  /gsd:session-report
  Total: 29 GSD command invocations

Tests: XX/XX passed
Final version: 1.5.0
git log --oneline -10: [paste actual output]

Skipped or failed: [list with error reason]
```

---

## GUARDRAILS — Read before starting, follow throughout

1. **NEVER** use `/gsd:quick`. Use full GSD workflow at every step.
2. **NEVER** add "Co-authored-by", "Generated by AI", or any AI attribution to any commit, comment, or file.
3. **NEVER** edit a file without reading it in full first.
4. **NEVER** hardcode config paths from memory — verify from RESEARCH-V2.md.
5. **ALWAYS** run `npm run build && npm test` before committing any phase.
6. **ALWAYS** use `/gsd:discuss-phase` before `/gsd:plan-phase` — never skip discuss.
7. **ALWAYS** use `/gsd:verify-work` after `/gsd:execute-phase` — never skip verify.
8. **NEVER** run `npm publish`. Publishing is Rodolf's decision.
9. If OSV.dev API fails, the scanner must fail silently — never crash the scan.
10. The .env leak scanner must NEVER output secret values — only key names and file paths.
11. If a phase fails after 2 fix attempts, document it and move to the next phase.
12. Commit messages must be written like a senior engineer who cares about git history.
13. One commit per phase. No "fix: oops" or "update" commits.
14. Version bumps are sequential: 1.0.4 → 1.1.0 → 1.2.0 → 1.3.0 → 1.4.0 → 1.5.0.
