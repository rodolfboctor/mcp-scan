# Phase 4: Scanner Depth — Context

## Goal
Implement advanced scanning capabilities.

## Key Decisions
- **Prompt injection scanner** (`src/scanners/prompt-injection-scanner.ts`):
  - Strings: "ignore previous instructions", "ignore all prior", "you are now", "disregard", "forget your instructions", "override your"
  - Unicode: U+200B, U+FEFF, U+202E, U+00AD
  - Base64 > 50 chars: `/[A-Za-z0-9+/]{50,}={0,2}/`
  - Tool names: `bash`, `python`, `eval`, `exec`, `shell`, `terminal`, `run`, `system`
  - `additionalProperties: true` at schema root
  - IDs: `prompt-injection-pattern` (HIGH), `unicode-injection` (HIGH), `tool-name-shadow` (MEDIUM), `schema-bypass-risk` (LOW)

- **OSV.dev scanner** (add to `src/scanners/package-scanner.ts`):
  - POST `https://api.osv.dev/v1/query` with `{"package":{"name":"<pkg>","ecosystem":"npm"}}`
  - 5s timeout via AbortController, fail silently — NEVER crash
  - CVSS >= 9.0 → `known-vulnerability-critical` (CRITICAL), >= 7.0 → `known-vulnerability-high` (HIGH)

- **.env leak scanner** (`src/scanners/env-leak-scanner.ts`):
  - Check parent dirs of server file paths for `.env` files
  - Detect keys matching `*_KEY|*_SECRET|*_TOKEN|*_PASSWORD|API_*|AUTH_*` with values > 20 chars
  - Skip values containing `YOUR_`, `REPLACE`, `EXAMPLE`, `PLACEHOLDER`
  - `env-secret-exposed` (HIGH) — KEY NAME ONLY, never the value

## Implementation Approach
- Create `src/scanners/prompt-injection-scanner.ts` and integrate it into `src/commands/scan.ts`.
- Modify `src/scanners/package-scanner.ts` to include OSV.dev checks.
- Create `src/scanners/env-leak-scanner.ts` and integrate it into `src/commands/scan.ts`.
- Update `src/types/scan-result.ts` for new finding IDs and severities.

## Verification
- Run `npm run build` to ensure the project builds successfully.
- Run `npm test` to verify existing tests still pass and add new tests for the added scanners.
- Manually test each new scanner against relevant fixtures (new or existing) to confirm correct detection and severity assignment.

## canonical_refs
- GEMINI.md — all phase specs
- src/commands/scan.ts — scan orchestration
- src/scanners/ — directory for scanner implementations
- src/types/scan-result.ts — type definitions for scan findings

## code_context
- Existing scanner pattern: see `src/scanners/secret-scanner.ts`
- Test pattern: see `tests/scanners/` directory
- API call pattern: see `src/scanners/registry-scanner.ts` for external network calls (if any)
