# External Integrations

**Analysis Date:** 2024-05-15

## APIs & External Services

**Package Registry Information:**
- npm Registry (`https://registry.npmjs.org/`) - Used for fetching package metadata.
  - SDK/Client: Native `fetch` API.
  - Auth: Public API access, no authentication evident.
  - Files: `src/scanners/package-scanner.ts`

**Model Context Protocol (MCP) Servers (conceptual):**
- Various official and trusted community MCP server packages (e.g., `@modelcontextprotocol/server-postgres`, `mcp-server-github`). These are not directly integrated via API calls from this codebase but are identified and classified by the scanner based on hardcoded lists.
  - Files: `src/data/official-servers.ts`, `src/scanners/registry-scanner.ts`

## Data Storage

**Databases:**
- None directly integrated by this codebase. The scanner analyzes references to databases in configuration, but does not connect to them itself.

**File Storage:**
- Local filesystem only - For reading configuration files, project files, etc.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- None directly integrated or used for authentication by this codebase.
- The `secret-scanner` identifies potentially exposed API keys or secrets, implying that other systems interacting with MCP servers *would* use authentication.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Console logging via `src/utils/logger.ts` and `chalk`. No external logging service integration.

## CI/CD & Deployment

**Hosting:**
- Not applicable for a CLI tool, deployed via npm.

**CI Pipeline:**
- GitHub Actions (`.github/workflows/ci.yml`) - For automated testing and potentially publishing.

## Environment Configuration

**Required env vars:**
- No specific environment variables are explicitly required *by this tool for its own configuration*.
- The tool *scans for* environment variables and their usage, especially for secrets and missing references (`src/scanners/secret-scanner.ts`).

**Secrets location:**
- Not applicable for the tool's own operation, as it does not manage its own external secrets beyond what might be configured for CI/CD. The tool's purpose is to *find* secrets in other projects.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2024-05-15*