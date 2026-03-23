# Project: mcp-scan v1.0.3

## What This Is
A premium CLI security scanner for MCP server configurations, supporting multiple AI clients and specialized security scanners.

## Core Value
Provides developers and AI users with a high-fidelity, trusted tool to audit and secure their Model Context Protocol environments.

## Context
- **Market Segment**: AI developer tools, security.
- **User Personas**: Developers using Claude, Cursor, VS Code, etc., and MCP server authors.
- **Problem**: MCP servers have full system access; users need a reliable way to audit them for common risks.

## Requirements

### Validated
- ✓ **CLI-01**: CLI entry point with Commander.js — existing
- ✓ **SCAN-01**: Detect configurations for 7+ AI clients — existing
- ✓ **SCAN-02**: 7 parallel scanners (secrets, typosquat, etc.) — existing
- ✓ **UI-01**: Premium visual output (rounded boxes, cards, structured summary) — existing
- ✓ **UI-02**: Brand-blue spinner — existing

### Active
- [ ] **MKT-01**: ugig.net marketplace nudge on clean scans
- [ ] **MKT-02**: Optional `--ugig` flag for marketplace link
- [ ] **DOC-01**: Updated README with CLI reference and integrations table

### Out of Scope
- External API integrations for server submission (Phase 2+)
- Multi-repo support for scan results

## Roadmap

### Phase 1: Premium Visuals (Complete)
- Upgrade reporter visuals
- Refine footer and spinner

### Phase 2: Marketplace Integration
- Implement ugig.net nudge
- Add CLI flag and README updates

## Evolution
This document evolves at phase transitions.

---
*Last updated: 2026-03-23 after initialization*
