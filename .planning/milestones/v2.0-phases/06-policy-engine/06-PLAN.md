# Plan: Phase 6 - Policy Engine

## Goal
Implement a fully integrated security policy engine that allows users to customize scan findings using YAML-based rules.

## Tasks

### 1. Refactor `src/policy/engine.ts`
- [ ] Add support for matching by `finding_id` and `severity`.
- [ ] Add `description` to `PolicyRule`.
- [ ] Improve matching logic to be more robust.

### 2. Update `src/commands/scan.ts`
- [ ] Add `policyFile` to `runScan` options.
- [ ] Load policy using `loadYamlPolicy`.
- [ ] Call `applyPolicy` on results before returning the report.
- [ ] Recalculate summary counts (critical, high, etc.) after policy application.

### 3. Update `src/commands/policy.ts`
- [ ] Implement `init` action.
- [ ] Implement `show` action.
- [ ] Improve `validate` output.

### 4. Update `src/index.ts`
- [ ] Add `--policy <path>` to `scan` command.

### 5. Verification & Testing
- [ ] Create `tests/policy/engine.test.ts` (if it doesn't exist) or update it.
- [ ] Run a scan with a custom policy and verify finding overrides.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Custom security policies via YAML are functional.
- [ ] `policy` command supports `init`, `validate`, and `show`.
- [ ] `scan --policy` correctly applies rules to findings.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
