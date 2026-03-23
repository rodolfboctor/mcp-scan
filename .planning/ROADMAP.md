# Roadmap

## Summary
- **2 phases total**
- **5 requirements mapped**
- All v1 requirements covered ✓

## Phases

| # | Phase | Goal | Requirements | Success Criteria | Status |
|---|-------|------|--------------|------------------|--------|
| 1 | Premium Visuals | High-fidelity terminal output | CLI-01, SCAN-01, SCAN-02, UI-01, UI-02 | Visual match with spec | Complete |
| 2 | Marketplace Integration | ugig.net marketplace nudge | MKT-01, MKT-02, MKT-03, DOC-01, DOC-02 | Nudge appears on clean scan | Complete |

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
