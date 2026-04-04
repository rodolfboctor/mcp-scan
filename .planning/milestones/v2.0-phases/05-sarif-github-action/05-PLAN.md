# Plan: Phase 5 - SARIF & GitHub Action

## Goal
Improve the SARIF (Static Analysis Results Interchange Format) reporting for enterprise CI/CD integration and enhance the GitHub Action.

## Tasks

### 1. Update `src/utils/sarif-reporter.ts`
- [ ] Add static metadata for common findings (id, shortDescription, fullDescription, helpUri).
- [ ] Better mapping from `Severity` to SARIF `level`.
- [ ] Ensure `path.relative` handles all config paths correctly.

### 2. Update `src/commands/scan.ts`
- [ ] Add `sarif` to `runScan` options.
- [ ] If `options.sarif` is present, call `writeSarifReport`.
- [ ] Update `src/index.ts` to handle the `--sarif` command line argument.

### 3. Update `action/src/action.ts`
- [ ] Map all relevant GitHub Action inputs to `runScan` options.
- [ ] Improve log output for the GitHub Action.

### 4. Verification & Testing
- [ ] Create `tests/utils/sarif-reporter.test.ts` (if it doesn't exist) or update it.
- [ ] Run a scan with `--sarif` on a sample server.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Valid SARIF 2.1.0 output containing scan findings.
- [ ] `--sarif` flag working on the CLI.
- [ ] GitHub Action correctly reporting findings and failing on thresholds.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
