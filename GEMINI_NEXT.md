# Gemini: Polish mcp-scan for npm publish and viral launch

The project builds and tests pass. Now make it publish-ready and launch-ready. Do everything below in order.

## 1. npm publish prep

- Add `#!/usr/bin/env node` as the first line of `src/index.ts` (the shebang for CLI)
- Verify `dist/index.js` has the shebang after build
- Add `"files": ["dist"]` to package.json so only dist gets published
- Add `"engines": { "node": ">=18" }` to package.json
- Run `npm run build` and verify clean output
- Run `npm pack --dry-run` and verify only dist/ files are included (no src/, no tests)

## 2. README upgrade for viral launch

The README needs to be a KILLER landing page. This is what HN/Reddit sees first.

Structure it exactly like this:
1. **Hero section**: ASCII art logo or bold header. One-line pitch: "Security scanner for your MCP server configs. Find leaked secrets, typosquatting, and misconfigurations before they bite you."
2. **Install**: `npm install -g mcp-scan` then `npx mcp-scan` (show both)
3. **Demo**: Show a realistic terminal output of what a scan looks like. Use a fenced code block with color descriptions. Show it finding real issues (a leaked API key pattern, a typosquatted server name, an overly permissive path).
4. **What it checks**: Table with columns: Check | What it catches | Example
   - Secret detection: API keys, tokens in env vars and args
   - Typosquat detection: Misspelled package names (@modelcontextprotocol vs @modeicontextprotocol)
   - Permission scanning: Overly broad filesystem access (/ instead of ~/projects)
   - Config validation: Missing env vars, malformed JSON, injection in args
   - Transport security: HTTP instead of HTTPS for SSE servers
5. **Supported tools**: Claude Desktop, Cursor, VS Code Copilot, Claude Code, Windsurf (with config paths)
6. **CI/CD usage**: Show GitHub Actions YAML snippet for running mcp-scan in CI
7. **JSON output**: `mcp-scan --json` for programmatic use
8. **Contributing**: Short, welcoming
9. **License**: MIT

Make it scannable. Short paragraphs. Lots of code blocks. No walls of text.

## 3. Add missing features (if not already present)

Check if these exist. If not, add them:

- `--json` flag for JSON output (for CI/CD piping)
- `--fix` flag that auto-fixes what it can (like adding missing env var placeholders)
- `--severity` flag to filter by severity (low/medium/high/critical)
- Exit code 1 when critical issues found (important for CI/CD)
- Version command: `mcp-scan --version`

## 4. Add a GitHub Actions workflow

Create `.github/workflows/ci.yml`:
- Runs on push to main and PRs
- Node 18 and 20
- Steps: install, build, test, lint

## 5. Final QA

- Run `npm run build` - must be clean
- Run `npm test` - all must pass
- Run `node dist/index.js --help` - must show help
- Run `node dist/index.js` - must scan and produce output
- Run `node dist/index.js --json` - must produce valid JSON
- Run `npm pack --dry-run` - verify package contents
- Commit everything with message: `chore: prepare for npm publish`
- Push to GitHub

## DO NOT:
- Change the core scanner logic (it works, don't touch it)
- Add new scanners (scope creep)
- Rewrite tests (they pass)
- Add any AI attribution to commits
- Use em dashes in any text

## Git author for all commits:
```
git config user.name "Abanoub Rodolf Boctor"
git config user.email "abanoub.rodolf@gmail.com"
```
