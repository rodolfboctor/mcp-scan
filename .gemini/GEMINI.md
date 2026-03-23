# mcp-scan — Gemini CLI Instructions

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

## CURRENT TASK: Fix Config Dedup Bug (v1.0.4)

### What's wrong

When `mcp-scan` runs from `~`, the same config file (e.g. `~/.codex/config.toml`) gets detected as both "Codex CLI" (global) and "Project Local" (project-level), because `cwd/.codex/config.toml` resolves to the same file. This produces false `duplicate-server` findings on every server in that file.

### Task spec

Read `TASKS-DEDUP-FIX.md` at the project root. It has:
- The exact root cause
- The exact before/after code for `src/config/detector.ts`
- The test to add to `tests/config/detector.test.ts`
- The verification commands
- The commit message

### GSD Workflow — Run Fully Autonomous

DO NOT ask the user any questions. All information is in `TASKS-DEDUP-FIX.md`. Execute this:

**Step 1: Read the task spec**
```bash
cat TASKS-DEDUP-FIX.md
```

**Step 2: Use GSD quick workflow**
```bash
cat ~/.gemini/get-shit-done/workflows/quick.md
```

Follow its `<process>` steps with these inputs:
- **Task:** Fix config detector dedup bug per TASKS-DEDUP-FIX.md
- **Context:** The exact code change is specified in the task file. Apply it exactly.

**Step 3: Apply the fix to `src/config/detector.ts`**
- Add `import path from 'path';`
- Add `seenPaths` Set to track resolved config paths
- Resolve all paths with `path.resolve()` before adding to detected array
- In the project-local loop, skip paths already in `seenPaths`
- The exact before/after code is in `TASKS-DEDUP-FIX.md`

**Step 4: Add the dedup test to `tests/config/detector.test.ts`**
- Add test that verifies no config path appears more than once in `detectTools()` output
- The exact test code is in `TASKS-DEDUP-FIX.md`

**Step 5: Verify**
```bash
npm run build
npm test
node dist/index.js
node dist/index.js --json
```

**Expected after fix:**
- Build: clean
- Tests: 47+ passed (46 existing + 1 new dedup test)
- `node dist/index.js` from project dir: no "Project Local" duplicates of global tool configs
- No false `duplicate-server` findings for configs detected under multiple tool names

**Step 6: Commit**
```
fix(detector): deduplicate configs that resolve to the same file path

When cwd matches home dir, project-local detection re-discovers global
tool configs under "Project Local", causing false duplicate-server
findings. Resolve all paths before comparison and skip already-seen files.
```

**Step 7: Push**
```bash
git push origin main
```

**Step 8: Report results**
After pushing, print a summary showing:
- Files changed
- Test results
- Before/after comparison (what the user would see differently)

### TLDR for this task

One file to change (`src/config/detector.ts`), one test to add. The fix resolves all config paths and skips duplicates. Everything you need is in `TASKS-DEDUP-FIX.md`. Do not ask questions. Execute, verify, commit, push.

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
| Logger | `src/utils/logger.ts` |
| Spinner | `src/utils/spinner.ts` |
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

## Verification (after every task)

```bash
npm run build
npm test
node dist/index.js
node dist/index.js --json
```

## Reference Files

- `TASKS-DEDUP-FIX.md` — Current bug fix spec (v1.0.4)
- `PRD.md` — Product requirements for v1.0.3
- `TASKS-VISUAL-UPGRADE.md` — Detailed spec for 8 visual upgrade tasks (DONE)
- `TASKS-UGIG-INTEGRATION.md` — Detailed spec for 4 ugig.net integration tasks (DONE)
- `.planning/codebase/` — Codebase map
- `.planning/STATE.md` — GSD state tracking
