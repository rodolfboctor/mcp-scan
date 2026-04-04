# Research: Phase 6 - Policy Engine

## Current State
- `src/policy/engine.ts` implements a YAML policy parser and an `applyPolicy` function.
- It supports actions: `skip`, `block`, `warn`, `override-severity`.
- `src/commands/policy.ts` only supports `validate`.
- The main `runScan` command does NOT yet call `applyPolicy`.

## Goals
- Fully integrate the Policy Engine into the scanning lifecycle.
- Add a `--policy` flag to the CLI.
- Enhance the `policy` command with `init` and `show` actions.
- Improve rule matching capabilities (match by finding ID, severity, etc.).

## Proposed Changes
1. Update `src/policy/engine.ts`:
    - Improve `applyPolicy` to match by finding `id`.
    - Add support for matching by `severity`.
    - Add a `description` field to rules for better reporting.
2. Update `src/commands/scan.ts`:
    - Add `policy` to `runScan` options.
    - Load policy from file if specified.
    - Call `applyPolicy` on the final results before generating reports.
3. Update `src/commands/policy.ts`:
    - Add `init` action to create a default `.mcp-scan-policy.yml`.
    - Add `show` action to print the parsed policy rules.
4. Update `src/index.ts`:
    - Add `--policy <path>` option to the `scan` command.

## Verification Strategy
- Create a sample policy file that skips a specific finding and blocks another.
- Run `mcp-scan --policy policy.yml` and verify findings are modified accordingly.
- Test `mcp-scan policy validate` and `mcp-scan policy init`.
