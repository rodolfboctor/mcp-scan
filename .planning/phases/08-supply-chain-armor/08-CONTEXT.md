# Phase 8: Supply Chain Armor — Context

## Goal
Move from "static config check" to "supply chain intelligence". Score servers by contributor reputation, GitHub activity, and registry history. Detect "Rug Pulls" (owner changes).

## Key Decisions
- Implement `src/scanners/supply-chain-scanner.ts`.
- Integrate GitHub API (optional token, otherwise rate-limited) to fetch repo stars, fork count, last commit date, and contributor count.
- Calculate a 0-100 "Trust Score".
- Track ownership changes if possible (via registry metadata).
- ID: `supply-chain-low-trust` (MEDIUM), `supply-chain-rug-pull` (HIGH).

## Implementation Approach
1. Create `src/scanners/supply-chain-scanner.ts`.
2. Update `src/commands/scan.ts` to include the new scanner.
3. Update `src/types/scan-result.ts` with new IDs.
4. Add tests in `tests/scanners/supply-chain-scanner.test.ts`.

## Verification
- `npm run build && npm test`
- Mock GitHub API responses for tests.
- Smoke test with a known high-trust repo (e.g., `@modelcontextprotocol/server-postgres`).

## canonical_refs
- GEMINI.md — all phase specs
- src/scanners/package-scanner.ts — existing network-based scanner pattern

## code_context
- Need to handle GitHub API rate limits gracefully.
- Support `GITHUB_TOKEN` from env for higher limits.
