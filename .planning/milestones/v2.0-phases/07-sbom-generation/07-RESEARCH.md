# Research: Phase 7 - SBOM Generation

## Current State
- `src/utils/sbom-generator.ts` handles CycloneDX v1.5 JSON generation.
- `src/commands/sbom.ts` handles SPDX v2.3 tag-value generation inline.
- SBOMs currently only list components (servers), not findings.

## Goals
- Consolidate SBOM generation logic in `src/utils/sbom-generator.ts`.
- Improve both formats with more detailed metadata (hashes, dependencies if available).
- Add support for including scan findings as vulnerabilities in the SBOM.
- Ensure the `sbom` command is robust and provides clear feedback.

## Proposed Changes
1. Update `src/utils/sbom-generator.ts`:
    - Move `generateSpdx` logic here.
    - Enhance `generateSbom` (CycloneDX) to include a `vulnerabilities` section mapping scan findings.
    - Add basic support for component hashes if present in metadata.
2. Update `src/commands/sbom.ts`:
    - Simplify by calling consolidated generator functions.
    - Add `--include-findings` flag (optional).

## Verification Strategy
- Generate both CycloneDX and SPDX SBOMs for a test server with known findings.
- Validate CycloneDX JSON against the v1.5 schema.
- Validate SPDX tag-value output against SPDX 2.3 spec.
- Verify that findings are correctly represented in the `vulnerabilities` section of CycloneDX.
