# Project: mcp-scan

## What This Is
A premium CLI security scanner for MCP server configurations. Supports 16+ AI clients, 17+ parallel scanners, runtime proxy, enterprise TUI dashboard, and pluggable rule engine.

## Core Value
The most comprehensive open-source security tool for the MCP ecosystem. Positions for acquisition by security companies (Snyk, Socket, etc.).

## Current State: v2.0.1 — Shipped & Live

**npm**: `mcp-scan@2.0.1` (live on npm)
**GitHub**: Published to GitHub Marketplace as a GitHub Action
**Tests**: 180+ passing, 0 lint errors, clean build
**Communities**: Posted to r/LocalLLaMA, r/cybersecurity, Hacker News (Show HN)

## Completed Milestones

### v1.0 — Foundation (Phases 1-2)
- Premium terminal visuals (rounded boxes, brand spinner)
- ugig.net marketplace integration

### v2.0 — Security Platform Upgrade (Phases 1-8)
- **Data Flow Analyzer**: Refactored to pattern-based detection. Added clipboard/DB exfiltration and process sinks. Improved cross-server flow detection.
- **Network Egress Monitor**: Expanded known-endpoints.ts with AI/LLM domains. Added hex/reversed URL detection and query parameter exfiltration checks.
- **Data Controls & Privacy**: Expanded PII patterns (IBAN, VAT, etc.). Added data minimization checks and multi-format privacy reports with global Risk Scores.
- **Compliance Mapping**: Mapped findings to SOC 2, GDPR, HIPAA, PCI-DSS, and NIST. Added per-framework Compliance Scores.
- **SARIF & GitHub Action**: Implemented full SARIF v2.1.0 support with rule metadata. Simplified GitHub Action by leveraging native SARIF ingestion.
- **Policy Engine**: Implemented granular policy matching (skip, block, warn, override-severity). Integrated into the core scan lifecycle.
- **SBOM Generation**: Added SPDX and CycloneDX v1.5 support with vulnerability inclusion and component integrity hashes.
- **Announcement & Docs**: Refreshed documentation and prepared v2.0 announcement materials.

### v3.0 — Enterprise Shield & Runtime Guard (Future)
- Supply chain armor (trust scoring, rug-pull detection)
- Runtime guard proxy (JSON-RPC interception)
- Data privacy engine (PII masking)
- Enterprise TUI dashboard (blessed)
- Advanced rule engine (pluggable YAML/JSON rules)

## Recent Ship (v2.0.1)
- Full v2.0 security platform upgrade
- Data Flow, Egress, Privacy, Compliance, SARIF, Policy, SBOM
- GitHub Action v2 with SARIF support
- New docs/blog post for launch

## Context
- **Market Segment**: AI developer tools, security
- **User Personas**: Developers using Claude, Cursor, VS Code, Windsurf, etc. and MCP server authors
- **Competition**: Only comprehensive MCP security scanner in the ecosystem
- **Distribution**: npm (`npx mcp-scan`), GitHub Action (`rodolfboctor/mcp-scan@v2`), library import
- **Stats**: ~32k LOC, 17+ scanners, 16+ AI tools supported
- **Stack**: TypeScript 5.4, Node.js 18+, Vitest, Tsup, Zod, Blessed, Commander, Chalk

## Pending (User Actions)
- Submit Claude for OSS form (already filled in browser)
- Pin mcp-scan on GitHub profile

---
*Last updated: 2026-04-03*
