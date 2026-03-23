# Phase 2: Marketplace Integration - Plan

**Status**: Ready for execution
**Requirements**: MKT-01, MKT-02, MKT-03, DOC-01, DOC-02

## Plan Summary
This plan implements the ugig.net marketplace integration, including a clean-scan nudge, an optional CLI flag, and documentation updates.

## Waves

### Wave 1: Core Implementation
- **Plan 01**: Implement ugig.net nudge in reporter and add `--ugig` flag.

### Wave 2: Documentation
- **Plan 02**: Update README with CLI reference and integrations table.

---

## Plan 01: ugig.net Integration & CLI Flag
**Objective**: Add the marketplace nudge and the `--ugig` flag.
**Requirements**: MKT-01, MKT-02, MKT-03
**Files Modified**: `src/utils/reporter.ts`, `src/commands/scan.ts`, `src/index.ts`

### Tasks

1. **Implement ugig.net nudge in reporter**
   - `<read_first>`: `src/utils/reporter.ts`
   - `<action>`: Update `printReport` to accept `ugig` option. In the all-clear branch, add the nudge: `logger.log(dim('  All servers verified clean. List them on ') + chalk.hex('#339DFF').dim('ugig.net/mcp') + dim(' →'));`. Ensure it shows if `report.results.length > 0` AND (`allClear` OR `options.ugig`).
   - `<acceptance_criteria>`: `src/utils/reporter.ts` contains `ugig.net/mcp`.

2. **Add --ugig flag to scan command**
   - `<read_first>`: `src/index.ts`, `src/commands/scan.ts`
   - `<action>`: 
     - In `src/index.ts`: Add `.option('--ugig', 'Show ugig.net marketplace link for verified servers')` to the `scan` command.
     - In `src/commands/scan.ts`: Update `runScan` to accept `ugig?: boolean` in options and pass it to `printReport`.
   - `<acceptance_criteria>`: `src/index.ts` contains `--ugig`. `src/commands/scan.ts` passes `ugig` to `printReport`.

---

## Plan 02: README Updates
**Objective**: Document the new flag and enhance the integrations section.
**Requirements**: DOC-01, DOC-02
**Files Modified**: `README.md`

### Tasks

1. **Update CLI reference in README**
   - `<read_first>`: `README.md`
   - `<action>`: Add `mcp-scan --ugig` to the "All Commands" or "Installation" section.
   - `<acceptance_criteria>`: `README.md` contains `mcp-scan --ugig`.

2. **Update Integrations table in README**
   - `<read_first>`: `README.md`
   - `<action>`: Upgrade the ugig.net entry to: `| **ugig.net** | MCP marketplace — browse and list verified servers | [ugig.net/mcp](https://ugig.net/mcp) |`.
   - `<acceptance_criteria>`: `README.md` contains the upgraded ugig.net row.

---

## must_haves
- [ ] ugig.net line shows on clean scan.
- [ ] `--ugig` flag forces the line to show even with findings.
- [ ] JSON output is NOT affected by the nudge.
- [ ] README accurately reflects the new flag and integration.
