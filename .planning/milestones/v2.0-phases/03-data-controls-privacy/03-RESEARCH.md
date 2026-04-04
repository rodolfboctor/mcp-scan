# Research: Phase 3 - Data Controls & Privacy

## Current State
- `src/scanners/data-controls-scanner.ts` detects PII, consent, retention, deletion, encryption gaps, and prompt logging.
- `src/commands/privacy.ts` generates a basic privacy assessment report.
- PII patterns are limited to basic types (Email, Phone, CC, SSN, IP).

## Goals
- Expand PII detection patterns.
- Improve the privacy report with more detail and better formatting.
- Add "data minimization" check.
- Add "PII masking" capability to the reporter.

## Proposed Changes
1. Update `src/data/pii-patterns.ts`:
    - Add patterns for: API keys, passwords, physical addresses, names, DOB, zip codes, IBAN, and VAT numbers.
2. Update `src/scanners/data-controls-scanner.ts`:
    - Improve PII detection logic by combining patterns and keyword search.
    - Add `data-controls-minimization-risk` for tools that request more data than they seem to need.
3. Update `src/commands/privacy.ts`:
    - Add `--output` flag for file-based reports (Markdown/CSV).
    - Include summary of risks across all servers.
    - Improve visual presentation.

## Verification Strategy
- Create a test fixture with various PII types and data handling gaps.
- Verify the privacy report correctly identifies:
    - New PII types (e.g. IBAN, API Key).
    - Minimization risks.
    - All existing gaps (retention, encryption, etc.).
- Verify `--format json` and file-based output work correctly.
