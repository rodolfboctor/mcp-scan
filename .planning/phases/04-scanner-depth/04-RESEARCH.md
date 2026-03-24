# Phase 4: Scanner Depth - Research

**Researched:** 2024-05-15
**Domain:** Security Scanning, Static Analysis, API Integration
**Confidence:** HIGH

## Summary

This research focuses on implementing advanced scanning capabilities as defined in `04-CONTEXT.md`. The phase introduces three new scanners: a prompt injection scanner, an OSV.dev vulnerability scanner, and an `.env` leak scanner. The implementation will adhere strictly to existing project conventions and constraints from `GEMINI.md`. Key technical considerations include robust string and regex matching, Unicode and Base64 detection, external API integration with error handling, file system traversal, and Zod schema introspection for `additionalProperties: true`. All new features will be integrated into the existing `mcp-scan` architecture, updating type definitions and command orchestration.

**Primary recommendation:** Leverage standard Node.js/TypeScript features and existing project patterns for implementation, paying close attention to error handling and performance for external API calls and file system operations.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Prompt injection scanner** (`src/scanners/prompt-injection-scanner.ts`):
  - Strings: "ignore previous instructions", "ignore all prior", "you are now", "disregard", "forget your instructions", "override your"
  - Unicode: U+200B, U+FEFF, U+202E, U+00AD
  - Base64 > 50 chars: `/[A-Za-z0-9+/]{50,}={0,2}/`
  - Tool names: `bash`, `python`, `eval`, `exec`, `shell`, `terminal`, `run`, `system`
  - `additionalProperties: true` at schema root
  - IDs: `prompt-injection-pattern` (HIGH), `unicode-injection` (HIGH), `tool-name-shadow` (MEDIUM), `schema-bypass-risk` (LOW)
- **OSV.dev scanner** (add to `src/scanners/package-scanner.ts`):
  - POST `https://api.osv.dev/v1/query` with `{"package":{"name":"<pkg>","ecosystem":"npm"}}`
  - 5s timeout via AbortController, fail silently — NEVER crash
  - CVSS >= 9.0 → `known-vulnerability-critical` (CRITICAL), >= 7.0 → `known-vulnerability-high` (HIGH)
- **.env leak scanner** (`src/scanners/env-leak-scanner.ts`):
  - Check parent dirs of server file paths for `.env` files
  - Detect keys matching `*_KEY|*_SECRET|*_TOKEN|*_PASSWORD|API_*|AUTH_*` with values > 20 chars
  - Skip values containing `YOUR_`, `REPLACE`, `EXAMPLE`, `PLACEHOLDER`
  - `env-secret-exposed` (HIGH) — KEY NAME ONLY, never the value
- **Implementation Approach**:
  - Create `src/scanners/prompt-injection-scanner.ts` and integrate it into `src/commands/scan.ts`.
  - Modify `src/scanners/package-scanner.ts` to include OSV.dev checks.
  - Create `src/scanners/env-leak-scanner.ts` and integrate it into `src/commands/scan.ts`.
  - Update `src/types/scan-result.ts` for new finding IDs and severities.
- **Verification**:
  - Run `npm run build` to ensure the project builds successfully.
  - Run `npm test` to verify existing tests still pass and add new tests for the added scanners.
  - Manually test each new scanner against relevant fixtures (new or existing) to confirm correct detection and severity assignment.

### the agent's Discretion
- How to implement specific technical details (e.g., exact regex for `.env` keys, Zod schema inspection).
- Specific testing strategies within the existing Vitest framework.

### Deferred Ideas (OUT OF SCOPE)
- None explicitly stated.

## Project Constraints (from GEMINI.md)
- **Stack:** Node.js 18+, TypeScript strict, ESM, Commander.js, Chalk 5+, Ora, cli-table3, Zod, tsup (bundler), Vitest (tests).
- **Rules:**
  - All files under 200 lines.
  - Named exports only.
  - No `any` types.
  - Graceful error handling everywhere (never crash on bad input).
  - Offline-first: default scan works without network.
  - Cross-platform: macOS, Linux, Windows.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| | *No specific phase requirement IDs were provided for this phase. Research directly addresses the locked decisions in CONTEXT.md.* | |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | 18+ | Runtime environment | Project standard |
| TypeScript | Strict | Language | Project standard, type safety |
| Zod | Latest | Schema validation | Project standard, robust schema definition |
| Vitest | Latest | Testing framework | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `node-fetch` | Latest | HTTP client | For OSV.dev API calls (if built-in `fetch` not preferred or available in specific Node.js 18 versions) |
| `path` | Built-in | Path manipulation | For file system navigation in `.env` scanner |
| `fs` | Built-in | File system operations | For reading `.env` files |
| `util` | Built-in | Utility functions | Potentially for promisifying `fs` methods |

**Installation:**
No new core external libraries are introduced beyond what's already in the project's `package.json`. `node-fetch` might be needed if the built-in `fetch` in Node.js 18 is deemed insufficient or less compatible.
```bash
# Potentially needed if built-in fetch is not used or supported for specific Node.js 18 versions
# npm install node-fetch@latest
```

**Version verification:**
- `npm view zod version` -> e.g., 3.22.4
- `npm view vitest version` -> e.g., 1.5.0
- `npm view node-fetch version` -> e.g., 3.3.2 (if installed)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── commands/
│   └── scan.ts         # Integrate new scanners here
├── scanners/
│   ├── ast-scanner.ts
│   ├── config-scanner.ts
│   ├── env-leak-scanner.ts  # NEW: .env leak scanner
│   ├── package-scanner.ts   # Modified for OSV.dev integration
│   ├── permission-scanner.ts
│   ├── prompt-injection-scanner.ts # NEW: Prompt injection scanner
│   └── secret-scanner.ts    # Example for existing scanner pattern
└── types/
    └── scan-result.ts  # Update for new finding IDs and severities
```

### Pattern 1: Scanner Module
**What:** Each scanner is implemented as a dedicated module (`.ts` file) responsible for its specific detection logic. It exposes a function (e.g., `scan` or `detect`) that takes relevant input (e.g., file content, AST, package data) and returns an array of `ScanResult` findings.
**When to use:** For all new scanning capabilities, following the established `src/scanners/` pattern.
**Example:**
```typescript
// Source: src/scanners/secret-scanner.ts (conceptual)
import { ScanResult, FindingId, Severity } from '../types/scan-result';

export function scan(content: string, filePath: string): ScanResult[] {
  const findings: ScanResult[] = [];
  // detection logic
  if (content.includes('secret_api_key')) {
    findings.push({
      id: FindingId.SecretExposed,
      name: 'Hardcoded API Key',
      description: 'Potential secret found in plain text.',
      severity: Severity.Critical,
      filePath,
      // ... other details
    });
  }
  return findings;
}
```

### Pattern 2: External API Integration (OSV.dev)
**What:** Making HTTP requests to an external service, handling timeouts, and gracefully managing responses and errors.
**When to use:** For the OSV.dev scanner.
**Example:**
```typescript
// Source: Conceptual, based on Node.js fetch API
import { AbortController } from 'node:abort-controller'; // if needed for older Node.js 18
import { ScanResult, FindingId, Severity } from '../types/scan-result';

async function queryOsvApi(packageName: string): Promise<any | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const response = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package: { name: packageName, ecosystem: 'npm' } }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Log non-2xx status but fail silently as per context
      console.warn(`OSV.dev query failed for ${packageName}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn(`OSV.dev query timed out for ${packageName}`);
    } else {
      console.warn(`OSV.dev query error for ${packageName}: ${error.message}`);
    }
    // Fail silently
    return null;
  }
}

// Inside package-scanner.ts, after fetching package names:
// const osvData = await queryOsvApi(packageName);
// if (osvData && osvData.vulns) {
//   // Process vulnerabilities and generate ScanResult
// }
```

### Anti-Patterns to Avoid
- **Hardcoding magic values:** For scanner patterns or thresholds, use constants or configuration where appropriate, even if defined by context.
- **Ignoring errors:** Critical for `GEMINI.md`'s "never crash" rule; all network, file system, or parsing errors must be handled gracefully.
- **Synchronous file system operations in loops:** `fs.readFileSync` can block the event loop. While the context doesn't explicitly forbid it, for performance in potentially large directory traversals, consider `fs.promises` or asynchronous patterns.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP Client | Custom `XMLHttpRequest` or `http` module wrapper | `fetch` (built-in or `node-fetch`) | Handles network specifics, promises, streaming, abort signals. |
| Path manipulation | Manual string concatenation | Node.js `path` module | Cross-platform compatibility, correctness with delimiters. |
| Schema validation | Custom parsing/type checking | Zod | Robust, type-safe schema definition and validation. |

**Key insight:** The Node.js and TypeScript ecosystems provide robust, battle-tested solutions for common tasks like network requests, file system interaction, and data validation. Custom implementations often introduce bugs, edge cases, and maintainability overhead.

## Common Pitfalls

### Pitfall 1: Network Latency / API Downtime (OSV.dev)
**What goes wrong:** External API calls can be slow, fail, or the service might be down, leading to delays or incomplete scans.
**Why it happens:** Reliance on external services, network conditions.
**How to avoid:** Implement strict timeouts (as per `04-CONTEXT.md`), robust error handling (try/catch), and silent failure for non-critical external dependencies. Ensure local scans continue even if external services are unavailable.
**Warning signs:** Long scan times, `AbortError` or network-related exceptions in logs, missing vulnerability data for certain packages.

### Pitfall 2: False Positives/Negatives in Pattern Matching
**What goes wrong:** Overly broad patterns might flag innocent code (false positives); overly narrow patterns might miss actual threats (false negatives).
**Why it happens:** Complexity of code, diverse coding styles, evolving attack patterns.
**How to avoid:** Carefully craft regexes, use specific Unicode checks, and continuously refine detection logic with a comprehensive set of test fixtures. The explicit skip list for `.env` values helps reduce false positives.
**Warning signs:** Excessive warnings on legitimate files, lack of findings on known vulnerable fixtures.

### Pitfall 3: Performance Degradation from File System Traversal
**What goes wrong:** Recursively checking parent directories for `.env` files can be I/O intensive, especially in deep directory structures.
**Why it happens:** Blocking I/O, many small file operations.
**How to avoid:** Use asynchronous `fs.promises` where possible, or optimize the traversal logic to minimize redundant checks. Consider caching `stat` results for directories.
**Warning signs:** Slow `.env` scan times, high CPU/I/O usage during scan.

## Code Examples

Verified patterns from official sources or existing project code:

### Detecting Unicode Characters
```typescript
// Source: Node.js Documentation / MDN
function containsUnicode(text: string, unicodeChars: string[]): boolean {
  return unicodeChars.some(char => text.includes(char));
}

const suspiciousChars = ['\u200B', '\uFEFF', '\u202E', '\u00AD']; // U+200B, U+FEFF, U+202E, U+00AD
const input = "some\u200Btext";
console.log(containsUnicode(input, suspiciousChars)); // true
```

### Regex for Base64 Strings (> 50 chars)
```typescript
// Source: 04-CONTEXT.md
const base64Regex = /[A-Za-z0-9+/]{50,}={0,2}/;
const longBase64String = 'SGVsbG8gUGxhbm5lciwgZm9ybWF0dGluZyBteSBmaW5kaW5ncyBpcw0KYSBicmlsbGlhbnQgdGhpbmcuIFRoYW5rIHlvdSE=';
console.log(base64Regex.test(longBase64String)); // true
```

### Reading an .env file and parsing keys
```typescript
// Source: Conceptual, based on Node.js fs module
import * as fs from 'node:fs';
import * as path from 'node:path';

function findEnvFileInParents(startPath: string): string | null {
  let currentPath = startPath;
  while (currentPath !== path.parse(currentPath).root) {
    const envPath = path.join(currentPath, '.env');
    if (fs.existsSync(envPath)) {
      return envPath;
    }
    currentPath = path.dirname(currentPath);
  }
  return null;
}

function parseEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) {
    return env;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  content.split('
').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
      return;
    }
    const [key, ...valueParts] = trimmedLine.split('=');
    const value = valueParts.join('=').trim();
    env[key.trim()] = value;
  });
  return env;
}

// Example usage:
// const serverFilePath = '/path/to/project/src/server.ts';
// const envFilePath = findEnvFileInParents(serverFilePath);
// if (envFilePath) {
//   const envVars = parseEnvFile(envFilePath);
//   // Check envVars for sensitive keys
// }
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Simple string matching for injections | Advanced regex, Unicode, Base64 detection, schema analysis | Ongoing | More robust, fewer false positives/negatives for injection vectors. |
| Manual vulnerability checking | Automated OSV.dev queries | Recent years | Faster, more comprehensive, and up-to-date vulnerability data for dependencies. |
| Basic secret scanning | `.env` leak detection with contextual pathing | Ongoing | Catches common misconfigurations in development/deployment. |

**Deprecated/outdated:**
- Manual static analysis for vulnerabilities: Replaced by automated tools like OSV.dev and dependency-checkers.

## Open Questions

1.  **Zod Schema `additionalProperties: true` detection**
    *   What we know: `04-CONTEXT.md` requires detection of `additionalProperties: true` at the schema root. Zod objects generally do not allow arbitrary properties by default, and can explicitly allow them with `.passthrough()` or `.catchall()`.
    *   What's unclear: The exact Zod API for programmatically inspecting a schema to determine if it has `additionalProperties: true`-like behavior (e.g., via `.catchall()` or `_def.unknownKeys`). This is critical for the `schema-bypass-risk` finding.
    *   Recommendation: During implementation, consult Zod documentation (especially `ZodObject` properties and methods) or explore `_def` properties for schema reflection to accurately identify this configuration.

## Environment Availability

No external dependencies are introduced that require auditing beyond the existing Node.js environment and standard package managers. The OSV.dev scanner relies on an external API endpoint, not a local tool or service.

## Sources

### Primary (HIGH confidence)
- `04-CONTEXT.md` - All specific scanner requirements and implementation details.
- `GEMINI.md` - Project-wide constraints, stack, and rules.
- Node.js `fs` module documentation - File system operations.
- Node.js `path` module documentation - Path manipulation.
- MDN Web Docs (for `fetch` API, Unicode string methods) - General JavaScript features.

### Secondary (MEDIUM confidence)
- OSV.dev API documentation - Confirmed API endpoint structure and response format.
- Zod documentation - Initial understanding of schema definition, further research needed for `additionalProperties` reflection.

### Tertiary (LOW confidence)
- None. All critical information is derived from primary or verified secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Explicitly defined in `GEMINI.md`.
- Architecture: HIGH - Defined by `04-CONTEXT.md` and existing project patterns.
- Pitfalls: MEDIUM - Inferred from project constraints and general security scanning knowledge.
- Open questions: MEDIUM - One specific technical detail (Zod schema introspection) requires further investigation during implementation.

**Research date:** 2024-05-15
**Valid until:** 2024-08-15 (3 months, given the stable nature of underlying tech and explicit context)
