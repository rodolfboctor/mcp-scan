# Roadmap

- 🚧 **v2.0 Acquisition Readiness** — Phases 3-7 (in progress)

## Summary
- **7 phases total**
- **15 requirements mapped**
- All v1 requirements covered ✓

## Phases

| # | Phase | Goal | Requirements | Success Criteria | Status |
|---|-------|------|--------------|------------------|--------|
| 1 | Premium Visuals | High-fidelity terminal output | CLI-01, SCAN-01, SCAN-02, UI-01, UI-02 | Visual match with spec | Complete |
| 2 | Marketplace Integration | ugig.net marketplace nudge | MKT-01, MKT-02, MKT-03, DOC-01, DOC-02 | Nudge appears on clean scan | Complete |
| 3 | Coverage Breadth | Detect more tools than any competitor. Add 8+ new AI tool config paths. Add .mcp.json project-root support. Add --ci flag for CI/CD exit codes. | COV-01, COV-02, COV-03, COV-04, COV-05, COV-06, COV-07, COV-08, COV-09, CI-01 | mcp-scan detects Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, GitHub Copilot. `--ci` flag exits 1 on findings, 0 on clean. All existing tests pass. Build clean. | Planned |
| 4 | Scanner Depth | Find real security issues competitors miss. Add prompt injection scanner, OSV.dev CVE lookup, .env leak scanner, and protocol abuse scanner. | (not defined yet) | Prompt injection patterns detected in tool descriptions. OSV.dev API queried for npm packages — real CVEs surfaced as CRITICAL/HIGH findings. .env files with secrets in server working directories flagged. All new scanners have tests. Build clean. | Not started |
| 5 | npm Library Export | Allow other tools to `import { runScan } from 'mcp-scan'` without CLI. Makes mcp-scan acquirable as a drop-in library. | (not defined yet) | `src/lib.ts` exports public API. package.json has `exports` field for both ESM and CJS. `node -e "const {runScan}=require('./dist/lib.cjs')"` works. README has Programmatic Usage section. | Not started |
| 6 | GitHub Action + SARIF | Let developers add mcp-scan to any CI pipeline in one step. Build GitHub Action with SARIF output that feeds into GitHub Security tab. | (not defined yet) | `action.yml` exists AT THE REPO ROOT. `action/dist/action.js` exists as the compiled entry point. SARIF 2.1.0 output validates against schema. `--sarif` CLI flag works. Example workflow file exists at `.github/workflows/mcp-scan-example.yml`. Build clean. | Not started |
| 7 | Community Health + Developer Experience | Make mcp-scan look like a serious, maintained open source project. Add CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, pre-commit hooks, better --help. | (not defined yet) | All 4 files exist and are substantive (not stubs). `.pre-commit-hooks.yaml` works. `node dist/index.js --help` shows examples. CHANGELOG covers all releases back to v1.0.3. | Not started |

---

## Phase Details

### Phase 1: Premium Visuals
**Status**: Complete
**Goal**: Upgrade reporter visuals and spinner.
**Success Criteria**:
1. Rounded box header with version.
2. Card-style findings with tree connectors.
3. Structured summary block.

### Phase 2: Marketplace Integration
**Status**: Complete
**Goal**: Add subtle nudge to ugig.net/mcp for clean servers.
**Requirements**: MKT-01, MKT-02, MKT-03, DOC-01, DOC-02
**Success Criteria**:
1. ugig.net line shows on clean `mcp-scan` run.
2. `--ugig` flag forces the line to show.
3. README updated with flag and integration details.

### Phase 3: Coverage Breadth
**Status**: Planned
**Goal**: Detect more tools than any competitor. Add 8+ new AI tool config paths. Add .mcp.json project-root support. Add --ci flag for CI/CD exit codes.
**Requirements**: COV-01, COV-02, COV-03, COV-04, COV-05, COV-06, COV-07, COV-08, COV-09, CI-01
**Plans:** 2 plans
- [ ] 03-01-PLAN.md — Expanded Tool Coverage
- [ ] 03-02-PLAN.md — CI Flag Implementation
**Success Criteria**:
1. mcp-scan detects Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, GitHub Copilot.
2. `--ci` flag exits 1 on findings, 0 on clean.
3. All existing tests pass. Build clean.

### Phase 4: Scanner Depth
**Status**: Not started
**Goal**: Find real security issues competitors miss. Add prompt injection scanner, OSV.dev CVE lookup, .env leak scanner, and protocol abuse scanner.
**Requirements**: (not defined yet)
**Success Criteria**:
1. Prompt injection patterns detected in tool descriptions.
2. OSV.dev API queried for npm packages — real CVEs surfaced as CRITICAL/HIGH findings.
3. .env files with secrets in server working directories flagged.
4. All new scanners have tests. Build clean.

### Phase 5: npm Library Export
**Status**: Not started
**Goal**: Allow other tools to `import { runScan } from 'mcp-scan'` without CLI. Makes mcp-scan acquirable as a drop-in library.
**Requirements**: (not defined yet)
**Success Criteria**:
1. `src/lib.ts` exports public API.
2. `package.json` has `exports` field for both ESM and CJS.
3. `node -e "const {runScan}=require('./dist/lib.cjs')"` works.
4. README has Programmatic Usage section.

### Phase 6: GitHub Action + SARIF
**Status**: Not started
**Goal**: Let developers add mcp-scan to any CI pipeline in one step. Build GitHub Action with SARIF output that feeds into GitHub Security tab.
**Requirements**: (not defined yet)
**Success Criteria**:
1. `action.yml` exists AT THE REPO ROOT.
2. `action/dist/action.js` exists as the compiled entry point.
3. SARIF 2.1.0 output validates against schema.
4. `--sarif` CLI flag works.
5. Example workflow file exists at `.github/workflows/mcp-scan-example.yml`.
6. Build clean.

### Phase 7: Community Health + Developer Experience
**Status**: Not started
**Goal**: Make mcp-scan look like a serious, maintained open source project. Add CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, pre-commit hooks, better --help.
**Requirements**: (not defined yet)
**Success Criteria**:
1. All 4 files exist and are substantive (not stubs).
2. `.pre-commit-hooks.yaml` works.
3. `node dist/index.js --help` shows examples.
4. CHANGELOG covers all releases back to v1.0.3.