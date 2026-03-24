# Project: mcp-scan v2.0

## What This Is
A premium CLI security scanner for MCP server configurations, supporting multiple AI clients and specialized security scanners.

## Core Value
Provides developers and AI users with a high-fidelity, trusted tool to audit and secure their Model Context Protocol environments.

## Current Milestone: v2.0 — Acquisition Readiness

**Goal:** Expand mcp-scan from a basic CLI scanner to a comprehensive MCP security platform with broad config coverage, deep analysis, library exports, GitHub Action with SARIF, and community health signals — positioning for acquisition by a security company like Snyk or Socket.

**Target features:**
- Coverage Breadth (v1.1)
- Scanner Depth (v1.2)
- Library Export (v1.3)
- GitHub Action + SARIF (v1.4)
- Community Health (v1.5)

## Context
Current state: v1.0.4 CLI scanner. 5 phases planned: Coverage Breadth (v1.1), Scanner Depth (v1.2), Library Export (v1.3), GitHub Action + SARIF (v1.4), Community Health (v1.5). See .claude/commands/build-mcp-scan.md for full spec.
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
- ✓ **MKT-01**: ugig.net marketplace nudge on clean scans — Phase 2
- ✓ **MKT-02**: Optional `--ugig` flag for marketplace link — Phase 2
- ✓ **DOC-01**: Updated README with CLI reference and integrations table — Phase 2

### Active
(None)

### Out of Scope
- External API integrations for server submission (Phase 2+)
- Multi-repo support for scan results

## Roadmap

### Phase 1: Premium Visuals (Complete)
- Upgrade reporter visuals
- Refine footer and spinner

### Phase 2: Marketplace Integration (Complete)
- Implement ugig.net nudge
- Add CLI flag and README updates

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-23*
