# mcp-scan Project Instructions

## GSD Workflow Integration

This project uses the GSD (Get Shit Done) workflow system. GSD workflow files are installed at `~/.gemini/get-shit-done/workflows/`.

**CRITICAL: How to use GSD workflows autonomously**

You CANNOT invoke `/gsd:` slash commands from within tool calls or shell commands. Slash commands only work when typed by the user at the Gemini CLI prompt. When instructed to "use GSD", follow this process instead:

1. **To use any GSD workflow**, READ the workflow file directly:
   - Quick task: `cat ~/.gemini/get-shit-done/workflows/quick.md`
   - Map codebase: `cat ~/.gemini/get-shit-done/workflows/map-codebase.md`
   - New project: `cat ~/.gemini/get-shit-done/workflows/new-project.md`
   - Execute phase: `cat ~/.gemini/get-shit-done/workflows/execute-phase.md`
   - Any other: `cat ~/.gemini/get-shit-done/workflows/<name>.md`

2. **Follow the workflow's `<process>` steps exactly** as written in the file.

3. **Use the GSD tools binary** when workflows reference it:
   ```bash
   node "$HOME/.gemini/get-shit-done/bin/gsd-tools.cjs" init quick
   ```

4. **Create `.planning/` directory structure** as workflows require:
   - `.planning/STATE.md` for state tracking
   - `.planning/quick/` for quick task plans
   - `.planning/codebase/` for codebase maps

5. **Commit patterns**: GSD uses atomic commits. One logical change per commit. Conventional commit messages.

## Task Plan

The primary task plan is in `TASKS.md` at the project root. It contains 12 hardening tasks for mcp-scan. When told to execute tasks, read TASKS.md and follow the GSD quick workflow to execute them.

## Recommended GSD workflow for this project

1. Read `~/.gemini/get-shit-done/workflows/quick.md` to understand the quick workflow
2. Read `TASKS.md` for the task descriptions
3. For each task:
   - Create a plan file in `.planning/quick/`
   - Execute the plan
   - Run `npm run build` and `npm test` to verify
   - Commit with conventional commit message
   - Update `.planning/STATE.md`

## Project Details

- **Language**: TypeScript
- **Build**: `npm run build` (tsup)
- **Test**: `npm test` (vitest)
- **Lint**: `npm run lint`
- **Author**: Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>
- **No AI attribution** in commits, comments, or code

## Research-First Rule

This is a security tool. Credibility is everything. Before implementing any security data (regex patterns, package lists, threat intel):
1. Research the actual format from official documentation
2. Verify against real examples
3. Do NOT fabricate or guess security data
4. If unsure, add a TODO comment instead of guessing
