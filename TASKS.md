# mcp-scan Hardening Tasks

> **For Gemini CLI**: Read this entire file before doing anything. Research every item before implementing. Do NOT assume package names, regex patterns, API formats, or file paths. Look them up. Verify against real documentation and real npm/PyPI registries. Every change must compile (`npm run build`) and pass tests (`npm test`).

## Context

mcp-scan is a Node.js/TypeScript CLI that scans MCP (Model Context Protocol) server configs for security issues. It's published on npm as `mcp-scan`. The codebase is in `src/`. Build with `tsup`, test with `vitest`.

Current problems: fake data in security lists, thin scanner coverage, stub scanners, missing tool support. This file describes everything that needs to be fixed and expanded to make this a credible, production-quality security tool.

---

## Task 1: Replace fake known-malicious list with real data

**File**: `src/data/known-malicious.ts`

**Problem**: The current list contains obviously fake package names like `mcp-fortnite-vbucks`, `mcp-roblox-robux`, `mcp-onlyfans-bypass`. These are fabricated. If anyone looks at the source code, it destroys all credibility for a security tool.

**What to do**:
1. RESEARCH: Search npm registry for real MCP-related packages that have been flagged, deprecated, or removed for malicious behavior. Search for real security advisories about MCP packages.
2. If you find real malicious MCP packages, add them.
3. If you can't find confirmed malicious ones (likely, since MCP is new), replace the entire list with an empty set AND add a comment explaining:
   - The list is community-sourced and starts empty
   - Users can report suspicious packages via GitHub issues
   - The tool still catches typosquatting, secrets, and permissions without this list
4. Add a `LAST_UPDATED` date comment at the top of the file.
5. Do NOT invent or guess package names. Only add confirmed real ones.

---

## Task 2: Expand secret patterns to 30+

**File**: `src/data/secret-patterns.ts`

**Problem**: Only 8 patterns. Missing many common API key formats that appear in MCP configs.

**What to do**:
1. RESEARCH each provider's actual API key format. Look at their official documentation for key prefixes and lengths. Do not guess regex patterns.
2. Add patterns for (research the actual format of each):
   - Google Cloud API Key (starts with `AIza`)
   - Google OAuth Client Secret
   - Supabase API keys (`sbp_` prefix, also `eyJ` JWT tokens for anon/service keys)
   - Firebase API Key
   - Vercel API Token
   - Azure API Key / Connection String
   - Twilio Account SID and Auth Token (`AC` prefix, 32 hex chars)
   - SendGrid API Key (`SG.` prefix)
   - Datadog API Key
   - HuggingFace Token (`hf_` prefix)
   - Pinecone API Key
   - Cohere API Key
   - Replicate API Token (`r8_` prefix)
   - Mistral API Key
   - Groq API Key (`gsk_` prefix)
   - Deepseek API Key
   - Together AI API Key
   - Perplexity API Key (`pplx-` prefix)
   - GitLab Token (`glpat-` prefix)
   - Bitbucket App Password
   - NPM Token (`npm_` prefix)
   - PyPI Token (`pypi-` prefix)
   - Docker Hub Token (`dckr_pat_` prefix)
   - Cloudflare API Token
   - DigitalOcean Token (`dop_v1_` prefix)
   - Heroku API Key
   - Railway Token
   - PlanetScale Token (`pscale_tkn_` prefix)
   - Neon Database Token
   - Private Key detection (`-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----`)
   - Generic high-entropy string detection (long base64 strings > 40 chars as LOW severity warning)
3. For EACH pattern, verify the regex against real examples from the provider's docs. Don't guess lengths or prefixes.
4. Add tests in `tests/scanners/secret-scanner.test.ts` for at least 10 of the new patterns. Use fake but format-correct test strings.

---

## Task 3: Expand official servers list

**File**: `src/data/official-servers.ts`

**Problem**: The list may be incomplete or outdated.

**What to do**:
1. RESEARCH: Go to the actual `@modelcontextprotocol` npm org page or the official MCP GitHub repo (https://github.com/modelcontextprotocol/servers) and get the REAL, COMPLETE list of official server packages.
2. Replace the current list with the verified complete list.
3. Also add well-known community servers that are widely trusted (if any exist and are clearly legitimate). Mark them differently with a comment.
4. Add a `LAST_UPDATED` date comment.

---

## Task 4: Implement the AST scanner (currently a stub)

**File**: `src/scanners/ast-scanner.ts`

**Problem**: Returns empty array. Listed as a feature but does nothing.

**What to do**:
1. The AST scanner should analyze server command strings and arguments for dangerous patterns:
   - Commands that start suspicious child processes (`bash -c`, `sh -c`, `eval`, `exec`)
   - Arguments that contain file glob patterns accessing sensitive dirs
   - Commands that pipe to `curl` or `wget` (data exfiltration risk)
   - Commands using `nc`/`netcat` (reverse shell risk)
   - Python one-liners with `exec()` or `eval()`
   - Node.js with `-e` flag running inline code
2. This doesn't need actual AST parsing. Pattern matching on command + args is fine. Rename the function if needed for clarity.
3. Wire it into the scan pipeline in `src/commands/scan.ts` if it's not already called.
4. Add tests.

---

## Task 5: Add Codex CLI support (TOML parsing)

**Files**: `src/config/paths.ts`, `src/config/parser.ts`, new file if needed

**Problem**: The commit message says "Gemini CLI / Codex" but Codex uses `~/.codex/config.toml` which is TOML format. The parser only handles JSON. Codex is NOT actually supported.

**What to do**:
1. RESEARCH: Verify the actual Codex CLI config location and format. It should be `~/.codex/config.toml` or similar. Look at Codex CLI documentation or source code.
2. RESEARCH: Verify the TOML structure. It likely uses `[mcp_servers]` or similar keys. Find out the exact schema.
3. Add a lightweight TOML parser. Options:
   - Use the `smol-toml` npm package (very small, no native deps) OR
   - Write a minimal TOML parser that handles the specific structure Codex uses (tables + key/value pairs)
4. Add Codex paths to `getConfigPaths()` for all platforms (darwin, win32, linux).
5. Update `parseConfig()` to detect `.toml` files and use the TOML parser.
6. Add Codex to `getProjectLevelPaths()` if there's a project-level config.
7. Add tests.
8. Update README.md to list Codex as supported.

---

## Task 6: Create the "Secured by mcp-scan" badge SVG

**File**: `.github/assets/badge-secured.svg`

**Problem**: A user (ralyodio, ugig.net marketplace) asked for a badge to display on their site. This is real adoption and we need to deliver.

**What to do**:
1. Create a clean, professional SVG badge similar to shields.io style.
2. Left side: shield icon or lock icon, dark background (#1a1a2e or similar dark color)
3. Right side: "mcp-scan" text, accent color (#4ade80 green or #60a5fa blue)
4. Full text: "Secured by mcp-scan" or "Scanned by mcp-scan"
5. Dimensions: ~200x20px (standard badge size, like shields.io badges)
6. Also create a larger version (~300x40px) for README banners
7. Make it look professional. Reference shields.io badge format for the standard size.
8. Add both to `.github/assets/`
9. Add a "Badge" section to README.md showing how to embed it:
   ```markdown
   [![Secured by mcp-scan](https://img.shields.io/badge/Secured%20by-mcp--scan-4ade80?style=for-the-badge)](https://github.com/rodolfboctor/mcp-scan)
   ```
   Also provide the custom SVG option.

---

## Task 7: Improve typosquat detection

**File**: `src/scanners/typosquat-scanner.ts`, `src/utils/levenshtein.ts`

**What to do**:
1. Read the current implementation first.
2. RESEARCH common typosquatting techniques: character swapping, homoglyph attacks (l vs 1, O vs 0), missing hyphens, extra characters, scope confusion (@modelcontextprotocol vs @modeicontextprotocol).
3. Enhance detection to check:
   - Levenshtein distance (already implemented, verify threshold is reasonable)
   - Homoglyph substitution (common character pairs)
   - Scope/namespace typos specifically for MCP packages
   - Missing or extra hyphens
4. The scanner should compare against both `official-servers.ts` AND common popular MCP community packages.
5. Add more test cases for edge cases.

---

## Task 8: Add env var reference detection

**File**: `src/scanners/secret-scanner.ts` or new scanner

**Problem**: Some configs use `${ENV_VAR}` syntax to reference environment variables instead of hardcoding secrets. This is GOOD practice and should be recognized. Currently the scanner might flag these incorrectly.

**What to do**:
1. When a value matches `${SOME_VAR}` or `$SOME_VAR` pattern, do NOT flag it as an exposed secret.
2. Instead, check if the referenced env var is actually set in the system. If not, flag as MEDIUM severity "referenced env var not found".
3. If the value is a plain string that matches a secret pattern, that's CRITICAL (current behavior, keep it).
4. This distinction makes the tool much more useful in practice.

---

## Task 9: Add more test coverage

**Directory**: `tests/`

**What to do**:
1. Check current test files and see what's covered.
2. Add tests for:
   - `transport-scanner.ts` (HTTP vs HTTPS detection)
   - `registry-scanner.ts` (known malicious, official, unverified)
   - `ast-scanner.ts` (after Task 4 implementation)
   - Config parser edge cases (empty file, malformed JSON, TOML after Task 5)
   - End-to-end: create a mock config, run full scan, verify output
3. Aim for at least 30 total tests.
4. All tests must pass: `npm test`

---

## Task 10: Improve the watch command

**File**: `src/commands/watch.ts`

**What to do**:
1. Read the current implementation.
2. It should use `fs.watch` or `chokidar` to monitor all detected config files for changes.
3. When a file changes, re-run the scan on that file and show results.
4. Show a clear "Watching X config files..." message on start.
5. Handle file deletion and creation gracefully.
6. If it's already working well, leave it. If it's a stub, implement it.

---

## Task 11: Add --fix flag implementation

**File**: `src/commands/fix.ts`, `src/config/writer.ts`

**What to do**:
1. Read the current implementation.
2. The fix command should be able to:
   - Move hardcoded secrets to environment variable references
   - Fix HTTP URLs to HTTPS where possible
3. If it's already implemented, verify it works.
4. If it's a stub, implement at least secret-to-env-var extraction (the most useful fix).

---

## Task 12: Update README with Codex support and new features

**File**: `README.md`

After completing the above tasks:
1. Add Codex to the supported tools list
2. Update the "What it checks" table with any new scanner capabilities
3. Make sure the demo output is realistic (not showing fake findings)
4. Add the badge section (from Task 6)
5. Add a "Threat Intelligence" or "Detection" section explaining what data sources the tool uses

---

## Build and Test Verification

After ALL tasks are complete:
1. Run `npm run build` - must succeed with zero errors
2. Run `npm test` - all tests must pass
3. Run `npx tsx src/index.ts` locally to verify it starts without errors
4. Run `npx tsx src/index.ts scan --json` to verify JSON output works
5. Run `npx tsx src/index.ts ls` to verify all tools are listed including new ones

---

## Rules

- RESEARCH before implementing. Do not guess API key formats, package names, or file paths.
- Every regex pattern must be verified against real documentation.
- Do not add fake or fabricated security data. This is a security tool. Credibility is everything.
- Keep the codebase clean TypeScript. No `any` types.
- Run build and tests after each major task to catch breakage early.
- Commit each task separately with a descriptive message.
- If you're unsure about something, add a TODO comment rather than guessing.
