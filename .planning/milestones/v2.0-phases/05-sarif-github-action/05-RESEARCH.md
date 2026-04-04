# Research: Phase 5 - SARIF & GitHub Action

## Current State
- `src/utils/sarif-reporter.ts` generates a basic SARIF 2.1.0 file.
- It maps findings to rules on the fly but lacks comprehensive rule metadata.
- It only provides file-level locations for findings (no line numbers).
- `action.yml` and `action/src/action.ts` already exist and provide basic CI integration.

## Goals
- Improve SARIF output with better rule descriptions and documentation links.
- Add support for line/column numbers if possible (at least pointing to the top of the file for now).
- Integrate SARIF generation into the main `scan` command via a flag.
- Improve the GitHub Action to handle all `runScan` options.

## Proposed Changes
1. Update `src/utils/sarif-reporter.ts`:
    - Define static metadata for common finding IDs (description, help URI).
    - Map findings more accurately to SARIF levels.
2. Update `src/commands/scan.ts`:
    - Add `--sarif` flag to specify an output file for SARIF reports.
    - Automatically call `writeSarifReport` if the flag is present.
3. Update `action/src/action.ts`:
    - Ensure it passes all relevant inputs to `runScan`.

## Verification Strategy
- Run the scanner with `--sarif results.sarif` on a test fixture.
- Validate the generated `results.sarif` with a SARIF validator or by uploading to a GitHub test repo.
- Verify the GitHub Action code correctly handles error cases and threshold failures.
