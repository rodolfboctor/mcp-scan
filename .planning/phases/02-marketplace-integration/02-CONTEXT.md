# Phase 2: Marketplace Integration - Context

**Gathered**: 2026-03-23
**Status**: Ready for planning

<domain>
## Phase Boundary
Add a subtle nudge to ugig.net/mcp for clean scan results and an optional `--ugig` flag to force it. Update README accordingly.
</domain>

<decisions>
## Implementation Decisions

### Marketplace Nudge
- **D-01**: Show "All servers verified clean. List them on ugig.net/mcp →" only on clean scans (all-clear).
- **D-02**: The nudge uses brand blue (#339DFF) for the link and dim weight for text.
- **D-03**: The nudge is display-only and NOT included in JSON output.

### CLI Flag
- **D-04**: Add `--ugig` boolean flag to the `scan` command.
- **D-05**: When `--ugig` is present, the nudge is shown even if there are findings.

### Documentation
- **D-06**: Update README CLI reference with `--ugig`.
- **D-07**: Update README Integrations table with detailed ugig.net info.

</decisions>

<canonical_refs>
## Canonical References
- `TASKS-UGIG-INTEGRATION.md` — Detailed spec for this phase.
- `PRD.md` — Product requirements for v1.0.3.
</canonical_refs>

<code_context>
## Existing Code Insights
### Reusable Assets
- `src/utils/reporter.ts`: `printReport` function is the main target for changes.
- `src/utils/logger.ts`: `logger` object for terminal output.
- `src/index.ts`: Commander.js setup for adding flags.
- `src/commands/scan.ts`: `runScan` orchestration logic.
</code_context>

---
*Phase: 02-marketplace-integration*
*Context gathered: 2026-03-23*
