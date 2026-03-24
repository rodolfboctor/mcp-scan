# Phase 9 Plan: The Guard Proxy (Runtime)

**Objective:** Build a runtime proxy to intercept and log JSON-RPC traffic.

## Tasks

### 1. Command Definition
- [ ] Add `proxy` command to `src/index.ts`.
- [ ] Define flags: `--command <cmd>`, `--args <args>`.

### 2. Implementation: src/commands/proxy.ts
- [ ] Implement `spawnServer()` to launch the target.
- [ ] Implement `pipeStreams()` with interceptors.
- [ ] Implement `JSON-RPC` chunk parser.
- [ ] Add audit logging to file.

### 3. Safety & Cleanup
- [ ] Handle child process exit.
- [ ] Ensure proxy exits when client exits.
- [ ] Signal handling (SIGINT, SIGTERM).

### 4. Verification
- [ ] Smoke test with a simple echo server.
- [ ] Verify log file generation.

## Verification
- Build and run
- Manual inspection of proxy logs
