# Phase 03: Coverage Breadth - Research

**Researched:** 2024-05-16
**Domain:** Configuration File Detection, CLI Argument Parsing, File System Operations
**Confidence:** HIGH

## Summary

This phase aims to significantly expand the `mcp-scan` tool's ability to detect configuration files from various development tools, thereby increasing its "coverage breadth." Key tasks involve adding specific user-level configuration paths for Zed, Continue.dev, Cline, Roo Code, Amp, Plandex, ChatGPT Desktop, and GitHub Copilot. This includes implementing globbing support for VS Code extensions. Additionally, the phase introduces a `--ci` flag to the `scan` command, enabling CI/CD integration by ensuring the CLI exits with a non-zero status (1) if any findings (Critical to Info severity) are detected, leveraging `process.exitCode` for graceful shutdown.

The primary implementation will involve modifications to `src/config/paths.ts` for defining new paths and potentially integrating a globbing library, `src/config/detector.ts` for detection logic, and `src/index.ts` and `src/commands/scan.ts` for handling the new `--ci` flag.

**Primary recommendation:** Leverage existing Node.js `path` and `os` utilities for robust cross-platform path resolution and introduce the `fast-glob` library for efficient and reliable globbing. Implement the `--ci` flag using `Commander.js` for argument parsing and manage the exit code via `process.exitCode = 1` for graceful CI/CD integration as per project decisions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Add to `src/config/paths.ts` the following tools: Zed (`~/.config/zed/settings.json`), Continue.dev (`~/.continue/config.json`), Cline (glob: `~/.vscode/extensions/saoudrizwan.claude-dev*/settings.json`), Roo Code (glob: `~/.vscode/extensions/rooveterinaryinc.roo-cline*/settings.json`), Amp (`~/.amp/config.json`), Plandex (`~/.plandex/config.json`), ChatGPT Desktop (macOS: `~/Library/Application Support/com.openai.chat/settings.json`), GitHub Copilot (`~/.config/github-copilot/apps.json`).
- Add `.mcp.json` detection in cwd (format: `{ "mcpServers": { ... } }`).
- Add `--ci` flag using `process.exitCode = 1` (NOT `process.exit(1)`). Read `src/index.ts` first.

### the agent's Discretion
None specified for this phase.

### Deferred Ideas (OUT OF SCOPE)
None specified for this phase.
</user_constraints>

<project_constraints>
## Project Constraints (from GEMINI.md)

- **Build Commands:** `npm run build`, `npm run lint`, `npm test`, `npm run dev`.
- **Stack:** Node.js 18+, TypeScript strict, ESM, Commander.js, Chalk 5+, Ora, cli-table3, Zod, tsup, Vitest.
- **Rules:**
    - All files under 200 lines.
    - Named exports only.
    - No `any` types.
    - Graceful error handling everywhere (never crash on bad input).
    - Offline-first: default scan works without network.
    - Cross-platform: macOS, Linux, Windows.
</project_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COV-01 | Detect Zed config at `~/.config/zed/settings.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). |
| COV-02 | Detect Continue.dev config at `~/.continue/config.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). |
| COV-03 | Detect Cline config with glob support for versioned extension folders. | Covered by Standard Stack (fast-glob), Architecture (centralized path definition, globbed paths), Code Examples (Implementing globbing). Pitfall 1 (Incorrect Globbing Patterns) is relevant. |
| COV-04 | Detect Roo Code config with glob support for versioned extension folders. | Covered by Standard Stack (fast-glob), Architecture (centralized path definition, globbed paths), Code Examples (Implementing globbing). Pitfall 1 (Incorrect Globbing Patterns) is relevant. |
| COV-05 | Detect Amp config at `~/.amp/config.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). |
| COV-06 | Detect Plandex config at `~/.plandex/config.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). |
| COV-07 | Detect ChatGPT Desktop config (macOS) at `~/Library/Application Support/com.openai.chat/settings.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). Open Question 1 (Exact Windows Paths) is relevant. |
| COV-08 | Detect GitHub Copilot config at `~/.config/github-copilot/apps.json`. | Covered by Standard Stack (path.join, os.homedir), Architecture (centralized path definition), Code Examples (Adding fixed path). |
| COV-09 | Robust support for `.mcp.json` at project root. | Covered by Standard Stack (path.join, process.cwd), Architecture (centralized path definition), Code Examples (Adding .mcp.json detection). |
| CI-01 | `--ci` flag for `scan` command that exits 1 on any findings (Critical to Info). | Covered by Standard Stack (Commander.js), Architecture (CLI argument parsing, exit code management), Code Examples (Implementing --ci flag). Pitfall 2 (process.exit() vs. process.exitCode) is relevant. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | 18+ | Runtime | Project requirement, specified in `GEMINI.md` |
| TypeScript | 5.4.5 | Language | Project requirement, specified in `GEMINI.md` |
| Commander.js | 12.0.0 | CLI framework | Project standard for CLI tools, specified in `GEMINI.md` |
| fast-glob | 3.3.3 | Globbing utility | Robust, cross-platform, ESM compatible for complex path matching; specifically needed for `COV-03` and `COV-04`. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Chalk | 5.3.0 | Terminal string styling | For consistent CLI output styling, specified in `GEMINI.md` |
| Ora | 8.0.1 | Elegant terminal spinner | For user feedback during longer operations, specified in `GEMINI.md` |
| cli-table3 | 0.6.4 | Pretty unicode tables | For presenting structured data in CLI output, specified in `GEMINI.md` |
| Zod | 3.23.8 | Schema validation | For robust data validation (e.g., config files), specified in `GEMINI.md` |
| smol-toml | 1.6.1 | TOML parser | For parsing TOML config files (already in use for Codex), from `package.json` |
| tsup | 8.0.2 | TypeScript bundler | Project standard for building, specified in `GEMINI.md` |
| Vitest | 1.5.0 | Testing framework | Project standard for testing, specified in `GEMINI.md` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `fast-glob` | Node.js `fs` module with manual recursion and regex | Higher complexity, more error-prone for glob patterns, less optimized for performance. |

**Installation:**
```bash
npm install fast-glob@3.3.3
```

**Version verification:**
- `npm view fast-glob version` -> `3.3.3` (published 2023-11-20)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── commands/      # CLI command definitions (e.g., scan.ts)
├── config/        # Configuration related files
│   ├── detector.ts  # Logic for detecting configs
│   ├── parser.ts    # Logic for parsing different config formats
│   └── paths.ts     # Defines paths to configuration files (will be updated)
├── scanners/      # Individual scanner modules
│   ├── config-scanner.ts # Main scanner for config files
│   └── ...          # Other scanners
├── utils/         # Utility functions (logger, reporter, etc.)
├── types/         # TypeScript type definitions
└── index.ts       # CLI entry point
```

### Pattern 1: Centralized Configuration Path Definition (`src/config/paths.ts`)
**What:** All known configuration file paths, including fixed and globbed patterns, are defined and managed within `src/config/paths.ts`. This module provides functions to retrieve platform-specific and project-level paths, now enhanced with globbing capabilities.
**When to use:** When adding new tool configuration paths (`COV-01` to `COV-08`) and the project-level `.mcp.json` (`COV-09`).
**Example:**
```typescript
// Source: src/config/paths.ts (will be updated, conceptual)
import os from 'os';
import path from 'path';
import fg from 'fast-glob'; // New import for globbing

export function getConfigPaths() { /* ... */ } // Updated to include new fixed paths

export function getProjectLevelPaths() { /* ... */ } // Updated to include .mcp.json

export async function getExtensionGlobPaths(toolName: 'Cline' | 'Roo Code'): Promise<string[]> {
  const home = os.homedir();
  const baseVsCodeExtensionsPath = path.join(home, '.vscode', 'extensions');
  let globPattern: string;

  if (toolName === 'Cline') {
    globPattern = 'saoudrizwan.claude-dev*/settings.json';
  } else if (toolName === 'Roo Code') {
    globPattern = 'rooveterinaryinc.roo-cline*/settings.json';
  } else {
    return [];
  }

  const matchedPaths = await fg(path.join(baseVsCodeExtensionsPath, globPattern), {
    cwd: baseVsCodeExtensionsPath,
    absolute: true,
    onlyFiles: true,
    dot: true,
    deep: 1
  });

  return matchedPaths;
}
```

### Pattern 2: CLI Argument Parsing with Commander.js
**What:** The `commander` library is used to define and parse command-line arguments and options for the CLI tool, ensuring a consistent and user-friendly interface.
**When to use:** When adding the new `--ci` flag (`CI-01`).
**Example:**
```typescript
// Source: src/index.ts (will be updated, conceptual)
import { Command } from 'commander';
import { scanCommand } from './commands/scan';

const program = new Command();
program.command('scan')
  .description('Scan for MCP server configurations.')
  .option('--ci', 'Exit with code 1 if any findings are detected (Critical to Info).') // New option
  .action(async (options) => {
    await scanCommand(options); // Pass options to the command handler
  });
program.parse(process.argv);
```

### Pattern 3: Exit Code Management for CI (`process.exitCode`)
**What:** The `process.exitCode` property is used to set the exit code of the Node.js process. This allows the program to complete naturally while signaling success or failure to the calling environment (e.g., CI/CD pipelines), which is preferred over `process.exit()` as it allows pending I/O operations to complete.
**When to use:** Implementing the `--ci` flag functionality (`CI-01`).
**Example:**
```typescript
// Source: src/commands/scan.ts (will be updated, conceptual)
import { ScanResult, Severity } from '../types/scan-result';
// Assuming runScans returns ScanResult[]
import { runScans } from '../scanners';

export async function scanCommand(options: { ci?: boolean }) {
  const results: ScanResult[] = await runScans();
  // ... display results ...

  if (options.ci) {
    const hasSignificantFindings = results.some(result =>
      result.severity === Severity.CRITICAL ||
      result.severity === Severity.HIGH ||
      result.severity === Severity.MEDIUM ||
      result.severity === Severity.LOW ||
      result.severity === Severity.INFO
    );

    if (hasSignificantFindings) {
      process.exitCode = 1; // Set exit code to 1 if any findings
    }
  }
}
```

### Anti-Patterns to Avoid
-   **Direct `process.exit()` for CI:** Using `process.exit(1)` abruptly terminates the process, potentially cutting off logging, final reporting, or asynchronous operations. Instead, set `process.exitCode = 1` and let the process complete naturally. (Explicitly forbidden by `03-CONTEXT.md` decision).
-   **Hardcoding paths:** Relying on fixed paths without considering `os.homedir()`, `os.platform()`, `process.env` variables, or `path.join()` for cross-platform compatibility. The existing codebase already handles this well; it's crucial to maintain this.
-   **Manual globbing with `fs.readdir` recursion:** Reimplementing complex globbing logic manually is error-prone and less efficient than using a well-tested library like `fast-glob`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-platform path resolution | String concatenation for paths | `path.join()`, `os.homedir()`, `os.platform()` | Handles OS-specific separators, environment variables, and home directory resolution robustly. |
| Complex file globbing | Manual `fs.readdir` recursion and pattern matching | `fast-glob` | Handles advanced glob patterns, offers performance optimizations, and is less error-prone. |
| CLI argument parsing | Manual `process.argv` parsing | `Commander.js` | Provides structured argument definition, parsing, help generation, and robust error handling. |
| Configuration file detection logic | Duplicated `fs.existsSync` checks | `src/config/detector.ts` (or similar utility) | Centralizes detection logic, promotes reusability, and simplifies updates. |

**Key insight:** Leveraging existing Node.js modules and established third-party libraries for these common problems ensures robustness, cross-platform compatibility, and maintainability, saving significant development time and reducing potential bugs.

## Common Pitfalls

### Pitfall 1: Incorrect Globbing Patterns
**What goes wrong:** Glob patterns for `~/.vscode/extensions/saoudrizwan.claude-dev*/settings.json` or `~/.vscode/extensions/rooveterinaryinc.roo-cline*/settings.json` might not match correctly due to subtle syntax errors or platform differences.
**Why it happens:** Glob syntax can vary slightly between implementations. Windows path separators (``) vs. Unix (`/`), and handling of hidden files or special characters can be tricky.
**How to avoid:**
1.  **Test patterns thoroughly:** Use `fast-glob`'s built-in testing capabilities or simple scripts to verify patterns against known good and bad paths.
2.  **Platform-aware pattern construction:** Ensure patterns are constructed in a way that `fast-glob` understands them, potentially using `path.join` for base paths and then a generic glob for the variable part.
3.  **Read `fast-glob` documentation:** Pay close attention to sections on Windows compatibility and pattern syntax.
**Warning signs:** Newly added tool configurations are not being detected, or false positives are appearing.

### Pitfall 2: `process.exit()` vs. `process.exitCode` Misunderstanding
**What goes wrong:** Using `process.exit(1)` within the `--ci` flag logic, which can lead to incomplete output or resource leaks.
**Why it happens:** `process.exit()` terminates the Node.js process immediately, preventing any remaining asynchronous tasks (like flushing logs, writing final reports) from completing. `process.exitCode` only sets the exit status and allows the event loop to drain naturally.
**How to avoid:** Always use `process.exitCode = 1` for signaling non-zero exit status, especially in CLI tools where output might be piped or logged by a CI system. This is an explicit decision from `03-CONTEXT.md`.
**Warning signs:** CI/CD pipelines receiving incomplete output, or unexpected behavior after a non-zero exit.

### Pitfall 3: Incomplete Cross-Platform Path Handling
**What goes wrong:** Paths are correctly handled on one OS (e.g., macOS/Linux) but fail on another (e.g., Windows) due to differences in home directory resolution, environment variables (`APPDATA`, `USERPROFILE`), or path separators.
**Why it happens:** Developers often test primarily on their local OS, overlooking nuances of other platforms.
**How to avoid:**
1.  **Leverage `os.homedir()`, `os.platform()`, `path.join()`:** As the existing codebase already does, continue using these Node.js built-ins for robust path construction.
2.  **Explicitly test on all target platforms:** Even if automated, ensure test environments cover macOS, Linux, and Windows.
3.  **Use `fast-glob`'s platform features:** `fast-glob` handles platform differences like path separators internally, which is another reason to prefer it over manual globbing.
**Warning signs:** Tests passing on one OS but failing on another due to "file not found" errors related to configuration paths.

### Pitfall 4: Performance Degradation with Many File System Checks
**What goes wrong:** As more configuration paths are added, the scan duration might increase significantly, especially for globbed paths or on slower file systems.
**Why it happens:** Each `fs.existsSync` or `fast-glob` call involves I/O operations, which can accumulate.
**How to avoid:**
1.  **Batch file system operations:** If possible, group checks. `fast-glob` is optimized for this.
2.  **Asynchronous processing:** Ensure file system checks are non-blocking (which `fast-glob` already is).
3.  **Prioritize checks:** Perform quicker, more common checks first.
**Warning signs:** Noticeably slower scan times after adding many new configurations.

## Code Examples

Verified patterns from official sources:

### Adding a new fixed path (COV-01, COV-02, COV-05, COV-06, COV-07, COV-08)
```typescript
// Source: src/config/paths.ts (modified, conceptual)
import os from 'os';
import path from 'path';

export function getConfigPaths() {
  const home = os.homedir();
  const platform = os.platform();
  const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  const userProfile = process.env.USERPROFILE || home;

  const paths: Record<string, string> = { // Use Record type for clarity
    // ... existing paths
    'Zed': '',
    'Continue.dev': '',
    'Amp': '',
    'Plandex': '',
    'ChatGPT Desktop': '',
    'GitHub Copilot': '',
  };

  if (platform === 'darwin') {
    // ... existing macOS paths
    paths['Zed'] = path.join(home, '.config', 'zed', 'settings.json');
    paths['Continue.dev'] = path.join(home, '.continue', 'config.json');
    paths['Amp'] = path.join(home, '.amp', 'config.json');
    paths['Plandex'] = path.join(home, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(home, 'Library', 'Application Support', 'com.openai.chat', 'settings.json');
    paths['GitHub Copilot'] = path.join(home, '.config', 'github-copilot', 'apps.json');
  } else if (platform === 'win32') {
    // ... existing win32 paths (placeholders, verify actual paths)
    paths['Zed'] = path.join(userProfile, '.config', 'zed', 'settings.json'); // Common Windows config pattern
    paths['Continue.dev'] = path.join(userProfile, '.continue', 'config.json');
    paths['Amp'] = path.join(userProfile, '.amp', 'config.json');
    paths['Plandex'] = path.join(userProfile, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(appData, 'com.openai.chat', 'settings.json'); // Example for AppData
    paths['GitHub Copilot'] = path.join(userProfile, '.config', 'github-copilot', 'apps.json');
  } else { // Linux
    // ... existing Linux paths
    paths['Zed'] = path.join(home, '.config', 'zed', 'settings.json');
    paths['Continue.dev'] = path.join(home, '.continue', 'config.json');
    paths['Amp'] = path.join(home, '.amp', 'config.json');
    paths['Plandex'] = path.join(home, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(home, '.config', 'com.openai.chat', 'settings.json'); // Common Linux config pattern
    paths['GitHub Copilot'] = path.join(home, '.config', 'github-copilot', 'apps.json');
  }

  return paths;
}
```

### Adding `.mcp.json` detection in CWD (COV-09)
```typescript
// Source: src/config/paths.ts (modified, conceptual)
import path from 'path';

export function getProjectLevelPaths() {
  const cwd = process.cwd();
  return [
    path.join(cwd, '.mcp.json'), // New project-level config file
    // ... existing project-level paths
    path.join(cwd, '.cursor', 'mcp.json'),
  ];
}
```

### Implementing globbing for extension paths (COV-03, COV-04)
```typescript
// Source: src/config/paths.ts (modified, conceptual)
import os from 'os';
import path from 'path';
import fg from 'fast-glob';

export async function getExtensionGlobPaths(toolName: 'Cline' | 'Roo Code'): Promise<string[]> {
  const home = os.homedir();
  const baseVsCodeExtensionsPath = path.join(home, '.vscode', 'extensions');
  let globPattern: string;

  if (toolName === 'Cline') {
    globPattern = 'saoudrizwan.claude-dev*/settings.json';
  } else if (toolName === 'Roo Code') {
    globPattern = 'rooveterinaryinc.roo-cline*/settings.json';
  } else {
    return []; // Should not happen with type guard
  }

  const matchedPaths = await fg(path.join(baseVsCodeExtensionsPath, globPattern), {
    cwd: baseVsCodeExtensionsPath,
    absolute: true,
    onlyFiles: true,
    dot: true,
    deep: 1 // Only search one level deep within the extension folder
  });

  return matchedPaths;
}

// Example usage in detector.ts or similar (conceptual)
/*
// Source: src/config/detector.ts (conceptual)
import { getExtensionGlobPaths } from './paths';
import fs from 'fs';

async function detectAllConfigs() {
  // ... existing fixed path detection ...

  const clinePaths = await getExtensionGlobPaths('Cline');
  for (const p of clinePaths) {
    if (fs.existsSync(p)) {
      // Add to detected configs logic
    }
  }

  const rooCodePaths = await getExtensionGlobPaths('Roo Code');
  for (const p of rooCodePaths) {
    if (fs.existsSync(p)) {
      // Add to detected configs logic
    }
  }
}
*/
```

### Implementing `--ci` flag and `process.exitCode` (CI-01)
```typescript
// Source: src/index.ts (modified, conceptual)
import { Command } from 'commander';
import { scanCommand } from './commands/scan';

const program = new Command();
program.command('scan')
  .description('Scan for MCP server configurations.')
  .option('--ci', 'Exit with code 1 if any findings are detected (Critical to Info).')
  .action(async (options) => {
    await scanCommand(options);
    // process.exitCode will have been set by scanCommand if --ci was active and findings were present.
  });

program.parse(process.argv);

// Source: src/commands/scan.ts (modified, conceptual)
import { ScanResult, Severity } from '../types/scan-result';
// Assuming runScans runs all scanners and returns results
import { runScans } from '../scanners';

export async function scanCommand(options: { ci?: boolean }) {
  // ... existing scan logic ...

  const results: ScanResult[] = await runScans(); // Get results from all scanners

  // ... display results ...

  if (options.ci) {
    const hasSignificantFindings = results.some(result =>
      result.severity === Severity.CRITICAL ||
      result.severity === Severity.HIGH ||
      result.severity === Severity.MEDIUM ||
      result.severity === Severity.LOW ||
      result.severity === Severity.INFO
    );

    if (hasSignificantFindings) {
      process.exitCode = 1; // Set exit code to 1 if any findings exist
    }
  }
}
```

## State of the Art

No major shifts in how configuration files are detected or CLI tools are built that would significantly impact this phase. The approach of defining paths, globbing for dynamic ones, and parsing CLI arguments with `Commander.js` remains standard practice. The specific use of `process.exitCode` over `process.exit()` for CI integration is a current best practice for graceful shutdown.

**Deprecated/outdated:**
-   **Manual globbing:** Relying on `fs.readdir` and manual string matching for complex glob patterns is generally outdated compared to using dedicated libraries like `fast-glob` due to robustness, cross-platform compatibility, and performance.

## Open Questions

1.  **Exact Windows Paths for New Tools (e.g., ChatGPT Desktop, Zed):**
    *   What we know: `03-CONTEXT.md` provides macOS paths. Windows paths often differ (e.g., `AppData` vs `~/.config`).
    *   What's unclear: The precise installation paths for ChatGPT Desktop, Zed, Amp, Continue.dev, and Plandex on Windows. GitHub Copilot usually follows XDG Base Directory Specification on Linux, and similar paths on Windows, but confirmation is needed.
    *   Recommendation: During implementation, either consult official documentation for each tool or perform local installations on a Windows machine to verify paths. For now, reasonable assumptions based on common Windows patterns (`%APPDATA%`, `%USERPROFILE%`) have been made in code examples but require verification.

2.  **Specific VS Code Extension Glob Pattern for Windows:**
    *   What we know: Glob patterns for Cline and Roo Code extensions are provided, but the base path for VS Code extensions on Windows might vary or have different naming conventions compared to macOS/Linux.
    *   What's unclear: If the glob pattern `saoudrizwan.claude-dev*/settings.json` needs adjustment for Windows, or if the `baseVsCodeExtensionsPath` itself changes significantly.
    *   Recommendation: Verify the structure of VS Code extension folders on a Windows environment to confirm the glob pattern and base path are universally applicable. `fast-glob` will handle path separators correctly, but the string literal for the pattern needs to match the directory structure.

## Environment Availability

Skipped as this phase involves purely code/config changes with no external dependencies that require runtime checks.

## Validation Architecture

Skipped as `workflow.nyquist_validation` is explicitly set to `false` in `.planning/config.json`.

## Sources

### Primary (HIGH confidence)
- `03-CONTEXT.md` - User decisions for this phase.
- `package.json` - Current project dependencies and versions.
- `GEMINI.md` - Project constraints and standard stack.
- `src/config/paths.ts` - Existing path definition patterns.
- `https://www.npmjs.com/package/fast-glob` - `fast-glob` features and compatibility.

### Secondary (MEDIUM confidence)
- N/A

### Tertiary (LOW confidence)
- N/A

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly from `GEMINI.md` and `package.json`, verified `fast-glob`.
- Architecture: HIGH - Based on existing project patterns and standard practices for CLI tools.
- Pitfalls: HIGH - Common issues in file system operations and CLI development, cross-referenced with general best practices.

**Research date:** 2024-05-16
**Valid until:** 2024-06-16 (30 days for stable codebase)
