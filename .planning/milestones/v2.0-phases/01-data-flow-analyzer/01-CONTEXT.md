# Phase 1: Data Flow Analyzer - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

Perform static analysis on MCP server tool definitions to map where user data flows.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — discuss phase was skipped per user setting. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/scanners/data-flow-scanner.ts` already contains heuristic mapping of sources and sinks.
- `src/data/data-flow-patterns.ts` contains the patterns used for detection.

### Established Patterns
- Pattern-based static analysis of tool descriptions and schemas.
- Severity-based finding generation.

### Integration Points
- `src/commands/scan.ts` integrates the data flow scanner into the main scan loop.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — discuss phase skipped. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.

</deferred>
