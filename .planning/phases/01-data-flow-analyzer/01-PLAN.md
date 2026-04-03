# Phase 1: Data Flow Analyzer - Plan

## Goal
Implement static analysis on MCP server tool definitions to map where user data flows.

## Research
- `src/scanners/data-flow-scanner.ts` already exists and provides the core functionality.
- It uses heuristic patterns to identify sources (e.g., local filesystem) and sinks (e.g., external network).

## Implementation
- Ensure `src/scanners/data-flow-scanner.ts` is integrated into the main scan command.
- Verify that it detects:
    - Exfiltration: Local source -> External sink
    - Credential Relay: Env -> Network/Process
    - Temp Storage Risk: Data stored in `/tmp` without cleanup.

## Verification
- Run tests: `tests/scanners/data-flow-scanner.test.ts`
- Run build: `npx tsc --noEmit`
