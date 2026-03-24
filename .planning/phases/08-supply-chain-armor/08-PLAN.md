# Phase 8 Plan: Supply Chain Armor

**Objective:** Implement supply chain intelligence by scoring servers based on GitHub reputation and registry history.

## Tasks

### 1. Update Types and IDs
- [ ] Add `supply-chain-low-trust` and `supply-chain-rug-pull` to `src/types/scan-result.ts`.
- [ ] Add `trustScore` optional field to `ServerScanResult`.

### 2. Implement Supply Chain Scanner
- [ ] Create `src/scanners/supply-chain-scanner.ts`.
- [ ] Implement `fetchRepoMetadata(repoUrl: string)` using GitHub API.
- [ ] Implement `calculateTrustScore(metadata: any)` logic.
- [ ] Handle rate limits and optional `GITHUB_TOKEN`.

### 3. Integrate into Main Loop
- [ ] Update `src/commands/scan.ts` to call the supply chain scanner.
- [ ] Update `ServerScanResult` type if needed to include score.

### 4. Testing
- [ ] Create `tests/scanners/supply-chain-scanner.test.ts`.
- [ ] Mock GitHub API calls.
- [ ] Verify score calculation.

## Verification
- `npm test`
- Build check
