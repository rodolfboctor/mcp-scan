# Research: Phase 1 - Data Flow Analyzer

## Current State
- `src/scanners/data-flow-scanner.ts` uses simple string heuristics (`toolStr.includes(...)`).
- It detects `data-exfiltration-risk`, `credential-relay-risk`, and `cross-server-flow`.
- `src/data/data-flow-patterns.ts` contains more comprehensive patterns that are NOT currently used by the scanner.
- The scanner doesn't check tool `properties` deeply, just the stringified tool definition.

## Goals
- Integrate `src/data/data-flow-patterns.ts` for more robust detection.
- Improve "read-and-send" pattern detection.
- Add detection for clipboard and database sources.
- Add detection for process execution and websocket sinks.
- Improve cross-server flow detection by passing `allServers`.

## Proposed Changes
1. Update `src/scanners/data-flow-scanner.ts`:
    - Import patterns from `src/data/data-flow-patterns.ts`.
    - Use `RegExp.test()` on tool name, description, and properties.
    - Categorize findings based on the type of source and sink.
2. Ensure `runScan` passes `allServers` to `scanDataFlow`.
3. Add tests for new detection patterns.

## Verification Strategy
- Create a test fixture with tools that match new patterns.
- Verify findings are generated correctly for:
    - Clipboard -> HTTP
    - Database -> HTTP
    - FS -> Process Execution
    - Credential Env -> WebSocket
