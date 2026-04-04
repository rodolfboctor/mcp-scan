# Plan: Phase 2 - Network Egress Monitor

## Goal
Enhance detection of external network endpoints and communication patterns an MCP server may use, with a focus on analytics, exfiltration, and obfuscated communication.

## Tasks

### 1. Update `src/data/known-endpoints.ts`
- [ ] Add more telemetry/analytics domains (Sentry, LogRocket, Hotjar, Dynatrace, etc.).
- [ ] Add more suspicious exfiltration endpoints (webhook.site, requestcatcher.com, ttrss, etc.).
- [ ] Add AI/LLM API endpoints (Google AI, Mistral, Groq, etc.).

### 2. Refactor `src/scanners/network-egress-scanner.ts`
- [ ] Implement hex-encoded URL detection.
- [ ] Implement reversed string URL detection (e.g., `ptth://`).
- [ ] Implement "data-in-URL" detection (long base64 in query params).
- [ ] Exclude private IP ranges from `network-egress-raw-ip`.
- [ ] Categorize findings for new types of endpoints correctly.

### 3. Verification & Testing
- [ ] Create `tests/scanners/network-egress-scanner.test.ts` (if it doesn't exist) or update it.
- [ ] Add test cases for all new detection patterns and categories.
- [ ] Verify no regressions in existing network egress detection.
- [ ] Run `npm test` and `npx tsc --noEmit`.

## Success Criteria
- [ ] Detect outbound endpoints, analytics, and obfuscated URLs.
- [ ] Correctly categorizes Sentry/LogRocket as telemetry.
- [ ] Identifies hex and reversed obfuscation.
- [ ] Identifies potential exfiltration in query parameters.
- [ ] 0 TypeScript errors.
- [ ] All tests passing.
