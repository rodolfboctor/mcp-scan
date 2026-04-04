# Plan: Phase 7 - SBOM Generation

## Goal
Consolidate and enhance SBOM generation capabilities, supporting CycloneDX and SPDX formats with detailed component and vulnerability information.

## Tasks

### 1. Refactor `src/utils/sbom-generator.ts`
- [ ] Move `generateSpdx` logic from `src/commands/sbom.ts` to here.
- [ ] Enhance `generateSbom` (CycloneDX) to include finding-to-vulnerability mapping.
- [ ] Add support for `vulnerabilities` array in CycloneDX.
- [ ] Add more metadata fields (hashes, external references) where available.

### 2. Update `src/commands/sbom.ts`
- [ ] Simplify to use consolidated generator functions.
- [ ] Ensure all CLI options are correctly passed to generators.

### 3. Verification & Testing
- [ ] Create `tests/utils/sbom-generator.test.ts` (if it doesn't exist) or update it.
- [ ] Verify both CycloneDX and SPDX formats with sample scan reports.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] `sbom` command generating valid CycloneDX v1.5 SBOMs.
- [ ] `sbom` command generating valid SPDX v2.3 SBOMs.
- [ ] Findings optionally included as vulnerabilities in CycloneDX.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
