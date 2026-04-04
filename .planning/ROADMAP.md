# Roadmap

- ✅ **v2.0 Security Platform Upgrade** — Phases 1-8 (SHIPPED)
- 🚧 **v3.0 Enterprise Shield & Runtime Guard** — Phases 9-13 (Planned)

---

<details>
<summary>✅ <b>v2.0 Security Platform Upgrade</b> — (SHIPPED)</summary>

## Summary
- **8 phases total**
- **Security Platform Upgrade**

## Phases

| # | Phase | Goal | Status |
|---|-------|------|--------|
| 1 | Data Flow Analyzer | Map where user data flows | [x] |
| 2 | Network Egress Monitor | Detect external network endpoints | [x] |
| 3 | Data Controls & Privacy Engine | Assess and enforce data handling policies | [x] |
| 4 | Compliance Framework Mapping | Map findings to SOC2, GDPR, HIPAA, etc | [x] |
| 5 | SARIF Output + GitHub Action | Enterprise CI/CD integration | [x] |
| 6 | Policy Engine | Custom security policies | [x] |
| 7 | SBOM Generation | CycloneDX and SPDX generation | [x] |
| 8 | Announcement & Documentation | Ship it | [x] |

---

## Phase Details (v2.0)

### Phase 1: Data Flow Analyzer - [x]
**Goal**: Perform static analysis on MCP server tool definitions to map where user data flows.
**Success Criteria**:
- Scanners for exfiltration, credential relay, read-and-send patterns.

### Phase 2: Network Egress Monitor - [x]
**Goal**: Detect external network endpoints an MCP server communicates with.
**Success Criteria**:
- Detect outbound endpoints, analytics, and obfuscated URLs.

### Phase 3: Data Controls & Privacy Engine - [x]
**Goal**: Assess and enforce data handling policies.
**Success Criteria**:
- Detect PII, retention policies, encryption, prompt logging. Generate privacy report.

### Phase 4: Compliance Framework Mapping - [x]
**Goal**: Map findings to compliance frameworks (SOC 2, GDPR, HIPAA, PCI-DSS, NIST).
**Success Criteria**:
- `compliance` command generating framework reports.

### Phase 5: SARIF Output + GitHub Action - [x]
**Goal**: Enterprise CI/CD integration with GitHub Code Scanning.
**Success Criteria**:
- `--sarif` flag, `action.yml` composite action.

### Phase 6: Policy Engine - [x]
**Goal**: Custom security policies via YAML.
**Success Criteria**:
- Policy parser and execution engine against findings.

### Phase 7: SBOM Generation - [x]
**Goal**: CycloneDX and SPDX generation.
**Success Criteria**:
- `sbom` command generating valid SBOMs.

### Phase 8: Announcement & Documentation - [x]
**Goal**: Overhaul docs, changelog, and marketing drafts.
**Success Criteria**:
- Fully updated README, blog, social posts, ready for npm publish.

</details>

## v3.0 Enterprise Shield & Runtime Guard (Planned)

**Goal**: Move from "static config check" to "runtime security and supply chain armor".

| # | Phase | Goal | Status |
|---|-------|------|--------|
| 9 | Supply Chain Armor | Reputation & Rug-pull detection | [ ] |
| 10 | The Guard Proxy | Runtime Interception (JSON-RPC) | [ ] |
| 11 | Data Privacy Engine | PII Masking & Data control | [ ] |
| 12 | Enterprise TUI | State-of-the-art dashboard | [ ] |
| 13 | Advanced Rule Engine | Pluggable Rule System | [ ] |

---

## Phase Details (v3.0)

### Phase 9: Supply Chain Armor
**Goal**: Move from "static config check" to "supply chain intelligence".
**Success Criteria**:
1. Integration with GitHub API for contributor/repo stats.
2. "Trust Score" (0-100) per server.
3. Alert on package owner changes or low reputation.

### Phase 10: The Guard Proxy (Runtime)
**Goal**: Intercept live traffic.
**Success Criteria**:
1. Command `mcp-scan proxy --server <name>` wraps an existing server.
2. Acts as a middleman for `stdio` or `sse` JSON-RPC.
3. Log all calls to a local secure audit file.

### Phase 11: Data Privacy Engine
**Goal**: Prevent PII from leaking to 3rd party MCP servers.
**Success Criteria**:
1. High-speed regex and NLP-lite detection for PII.
2. Configurable masking (e.g., `rodolf@thynkq.com` -> `[EMAIL_MASKED]`).
3. Zero-latency impact (< 5ms overhead).

### Phase 12: Enterprise Dashboard (TUI)
**Goal**: A visual command center.
**Success Criteria**:
1. Real-time scrolling log of proxy traffic.
2. Visual graphs of finding severities.
3. "Matrix-style" aesthetics matching ThynkQ brand.

### Phase 13: Advanced Rule Engine
**Goal**: Make the scanner a platform.
**Success Criteria**:
1. External rules directory `~/.mcp-scan/rules/`.
2. Support for custom detection patterns without recompiling.
3. Compatibility with standard security formats.
