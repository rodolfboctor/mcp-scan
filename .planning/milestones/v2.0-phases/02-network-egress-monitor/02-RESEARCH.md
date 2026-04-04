# Research: Phase 2 - Network Egress Monitor

## Current State
- `src/scanners/network-egress-scanner.ts` detects URLs, IPs, base64-encoded URLs, and non-standard ports.
- It uses `src/data/known-endpoints.ts` to categorize findings.
- Obfuscation detection is limited to base64 starting with 'http'.

## Goals
- Detect analytics/telemetry more broadly.
- Improve obfuscation detection (hex encoding, reversed strings, etc.).
- Add more common suspicious/API/CDN domains.
- Detect "data-in-URL" patterns (e.g. `?data=base64...`).

## Proposed Changes
1. Update `src/data/known-endpoints.ts`:
    - Add more analytics/telemetry providers (Sentry, LogRocket, Hotjar, etc.).
    - Add common exfiltration sinks (webhook.site, requestcatcher.com, etc.).
    - Add more AI-related APIs (Mistral, Google AI, etc.).
2. Update `src/scanners/network-egress-scanner.ts`:
    - Add regex for hex-encoded URLs.
    - Add regex for reversed 'http'/'https'.
    - Detect "data exfiltration via URL" (long base64 strings in query params).
    - Improve IP detection to exclude common internal ranges (e.g. `10.x.x.x`, `192.168.x.x`).

## Verification Strategy
- Create a test fixture with obfuscated and suspicious URLs.
- Verify findings are generated correctly for:
    - Hex-encoded URL
    - Reversed URL
    - Analytics endpoint
    - Suspicious exfiltration endpoint
    - Data-in-URL exfiltration
