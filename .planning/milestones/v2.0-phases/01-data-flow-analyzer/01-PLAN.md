# Plan: Phase 1 - Data Flow Analyzer

## Goal
Improve static analysis on MCP server tool definitions to map where user data flows and identify risks like exfiltration, credential relay, and read-and-send patterns.

## Tasks

### 1. Refactor `src/scanners/data-flow-scanner.ts`
- [ ] Import patterns from `src/data/data-flow-patterns.ts`.
- [ ] Use `DataFlowSource` and `DataFlowSink` types to improve categorisation.
- [ ] Add more comprehensive property-based analysis.
- [ ] Implement detection for new sources (clipboard, database) and sinks (processes, websockets).
- [ ] Improve cross-server flow detection.

### 2. Update `src/commands/scan.ts`
- [ ] Pass `activeServers` to `scanDataFlow` so it can analyze cross-server flows correctly.

### 3. Verification & Testing
- [ ] Create `tests/scanners/data-flow-scanner.test.ts` (if it doesn't exist) or update it.
- [ ] Add test cases for all new detection patterns.
- [ ] Verify no regressions in existing data flow detection.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Scanners for exfiltration, credential relay, read-and-send patterns.
- [ ] Correctly identifies clipboard and database sources.
- [ ] Correctly identifies process execution and websocket sinks.
- [ ] Correctly identifies cross-server references.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
