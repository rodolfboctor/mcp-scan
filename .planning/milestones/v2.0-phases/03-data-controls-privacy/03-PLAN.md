# Plan: Phase 3 - Data Controls & Privacy

## Goal
Improve detection of PII and privacy risks, and enhance the privacy assessment reporting capabilities.

## Tasks

### 1. Update `src/data/pii-patterns.ts`
- [ ] Add regex patterns for IBAN, VAT, Zip code, DOB, Address, Name, Password, and API Key.
- [ ] Ensure proper masking values are defined for each.

### 2. Refactor `src/scanners/data-controls-scanner.ts`
- [ ] Improve PII detection using `PII_PATTERNS`.
- [ ] Implement `data-controls-minimization-risk` detection.
- [ ] Ensure all findings have proper fix recommendations.

### 3. Update `src/commands/privacy.ts`
- [ ] Add support for `--output` (filename).
- [ ] Add support for multiple output formats (json, markdown, csv).
- [ ] Improve report layout with chalk colors and better sections.
- [ ] Include a "Risk Score" or summary section.

### 4. Verification & Testing
- [ ] Create `tests/scanners/data-controls-scanner.test.ts` or update it.
- [ ] Create `tests/commands/privacy.test.ts` or update it.
- [ ] Verify all new patterns and report features.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Correctly identifies PII (including new types).
- [ ] Correctly flags retention, encryption, and deletion gaps.
- [ ] Detects potential data minimization issues.
- [ ] Generates a comprehensive privacy report (console and file-based).
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
