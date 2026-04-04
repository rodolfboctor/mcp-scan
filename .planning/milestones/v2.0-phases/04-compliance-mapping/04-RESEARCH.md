# Research: Phase 4 - Compliance Mapping

## Current State
- `src/commands/compliance.ts` provides a basic report on framework coverage.
- Mappings for SOC2, GDPR, HIPAA, PCI-DSS, NIST exist but are quite minimal.
- Findings are mapped to control IDs, but many findings from previous phases are NOT yet included.

## Goals
- Broaden the findings coverage for all frameworks.
- Add more granular controls for each framework.
- Improve the compliance report output (add summary table and better formatting).
- Ensure all new findings from Phases 2, 3, 4 are correctly mapped.

## Proposed Changes
1. Update `src/data/compliance/soc2.ts`, `gdpr.ts`, `hipaa.ts`, `pci-dss.ts`, `nist.ts`:
    - Map new findings (e.g. `data-controls-minimization-risk`, `network-egress-data-in-url`, etc.).
    - Add more specific control IDs where relevant.
2. Update `src/commands/compliance.ts`:
    - Improve report presentation.
    - Add support for per-server compliance scoring.
    - Ensure robust error handling for missing frameworks.

## Verification Strategy
- Create a test fixture with various findings and run compliance reports.
- Verify that each framework report correctly identifies the findings and maps them to controls.
- Verify that new findings are showing up in the compliance reports.
