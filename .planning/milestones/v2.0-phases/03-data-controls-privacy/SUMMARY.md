# Phase 3 Summary: Data Controls & Privacy
**Completed:** 2026-04-03
**Status:** passed
## Accomplishments
- Updated `src/data/pii-patterns.ts` with more patterns (IBAN, VAT, Zip, Password, API Key, etc.).
- Refactored `src/scanners/data-controls-scanner.ts` with improved PII detection and data minimization check.
- Enhanced gaps detection for consent, retention, deletion, and encryption.
- Updated `src/commands/privacy.ts` with support for multiple output formats (JSON, CSV, MD) and a global Risk Score.
## Verification
- `tests/scanners/data-controls-scanner.test.ts`: 12/12 tests passed.
- `npx tsc --noEmit`: 0 errors.
