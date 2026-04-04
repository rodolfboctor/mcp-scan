# Plan: Phase 4 - Compliance Mapping

## Goal
Improve the mapping of scan findings to industry-standard compliance frameworks (SOC 2, GDPR, HIPAA, etc.) and enhance the reporting of compliance status.

## Tasks

### 1. Update Compliance Mappings
- [ ] Update `src/data/compliance/soc2.ts`.
- [ ] Update `src/data/compliance/gdpr.ts`.
- [ ] Update `src/data/compliance/hipaa.ts`.
- [ ] Update `src/data/compliance/pci-dss.ts`.
- [ ] Update `src/data/compliance/nist.ts`.
- [ ] Ensure all new findings from Phases 2, 3, 4 are mapped to relevant controls.

### 2. Update `src/commands/compliance.ts`
- [ ] Improve report layout with chalk and better summary tables.
- [ ] Add a per-framework compliance score (percentage of criteria met).
- [ ] Ensure all output formats (console, CSV, JSON) work as expected.

### 3. Verification & Testing
- [ ] Create `tests/commands/compliance.test.ts` (if it doesn't exist) or update it.
- [ ] Verify each framework's report correctly identifies findings.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Comprehensive mapping of findings to at least 5 major compliance frameworks.
- [ ] Clear, actionable compliance reports for each framework.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
