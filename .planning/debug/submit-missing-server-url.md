---
status: awaiting_human_verify
trigger: "mcp-scan submit command creates ugig.net listings without MCP server URL or GitHub link"
created: 2026-03-25T00:00:00Z
updated: 2026-03-25T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - Two root causes: (1) buildListingPayload hardcodes source_url to '' instead of using metadata.repositoryUrl, (2) ServerScanResult drops command/args from ResolvedServer so connection details are lost
test: Code review confirmed both issues
expecting: N/A - confirmed
next_action: Fix by adding connection fields to ServerScanResult and using them in buildListingPayload

## Symptoms

expected: When mcp-scan submit posts a listing to ugig.net/mcp, it should include the actual MCP server connection details (URL, command, args) and a GitHub link so users can find and use the server.
actual: Listings are created on ugig.net/mcp without server URL or GitHub link. Example: https://ugig.net/mcp/figma has no usable connection info.
errors: No errors - the submission succeeds but with incomplete data.
reproduction: Run `mcp-scan submit --ugig-key KEY` - the listings it creates on ugig.net are missing server URL/GitHub fields.
started: Since the submit feature was added (v1.7.0).

## Eliminated

## Evidence

- timestamp: 2026-03-25T00:01:00Z
  checked: buildListingPayload in src/commands/submit.ts line 32-58
  found: source_url hardcoded to '' (line 43). metadata.repositoryUrl is available on ServerScanResult but never used. tools array (line 33) initialized empty and never populated.
  implication: GitHub link always empty on ugig.net listings.

- timestamp: 2026-03-25T00:02:00Z
  checked: ServerScanResult type in src/types/scan-result.ts and construction in src/commands/scan.ts line 201-209
  found: ServerScanResult does not carry command/args fields. ResolvedServer has them but they are dropped when building ServerScanResult.
  implication: No way to derive server URL or connection command for the listing payload.

- timestamp: 2026-03-25T00:03:00Z
  checked: transport_type in buildListingPayload
  found: Hardcoded to 'stdio' (line 44). Server could be SSE or streamable-http transport but this is never detected.
  implication: Transport type always wrong for non-stdio servers.

## Resolution

root_cause: Three interconnected issues. (1) buildListingPayload hardcoded source_url to '' instead of using metadata.repositoryUrl. (2) ServerScanResult type did not carry the server connection details (command, args) from ResolvedServer, so there was no way to populate server_url. (3) The supply chain scanner (which populates metadata including repositoryUrl) only ran in verbose/sbom/ci mode, not when --submit was used, so metadata was always undefined during submission.
fix: Added connection field to ServerScanResult type. Populated it in scan.ts from the ResolvedServer. Added submit flag to runScan options and gated supply chain scanner to also run when submit=true. Rewrote buildListingPayload to use metadata.repositoryUrl for source_url, derive server_url from connection details, derive transport_type from command/args analysis, and include full connection object in payload.
verification: Build succeeds (npm run build). All 136 tests pass (npm test). Built output confirmed to contain source_url, server_url, transport_type, and connection fields in the payload.
files_changed: [src/types/scan-result.ts, src/commands/scan.ts, src/commands/submit.ts, src/index.ts]
