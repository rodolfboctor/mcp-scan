# Phase 9: The Guard Proxy (Runtime) — Context

## Goal
Intercept live traffic between AI clients and MCP servers. Provide real-time security inspection and logging.

## Key Decisions
- Implement `mcp-scan proxy` command.
- Proxy `stdio` (and eventually SSE).
- Intercept and parse JSON-RPC messages.
- Log traffic to `~/.mcp-scan/logs/proxy.log`.
- ID: `runtime-interception-active` (INFO).

## Implementation Approach
1. Create `src/commands/proxy.ts`.
2. Implement child process spawning for the target MCP server.
3. Pipe `stdin` from client -> proxy -> server.
4. Pipe `stdout` from server -> proxy -> client.
5. Parse chunks into JSON-RPC messages.
6. Add logging and basic validation.

## Verification
- `npm run build`
- Smoke test: `node dist/index.js proxy --server "@modelcontextprotocol/server-postgres" --args 'postgresql://...'` (or similar).
- Manual verification of logs.

## canonical_refs
- src/index.ts — for wiring the new command.

## code_context
- Need to handle binary vs text data carefully in stdio pipes.
- Ensure zero-latency impact (streaming).
