# Codebase Structure

**Analysis Date:** 2024-06-03

## Directory Layout

```
mcp-scan/
├── .claude/            # Configuration for the Claude AI tool
├── .gemini/            # Configuration for the Gemini AI tool
├── .github/            # GitHub Actions workflows and assets
├── .planning/          # Project planning, requirements, roadmap, and codebase documentation
├── dist/               # Compiled JavaScript output files
├── src/                # Primary application source code
│   ├── commands/       # CLI command implementations
│   ├── config/         # Configuration detection, parsing, writing utilities
│   ├── data/           # Static data used by scanners (e.g., malicious patterns, official servers)
│   ├── scanners/       # Core scanning logic for various checks (e.g., secret, typosquat, AST)
│   ├── types/          # TypeScript type definitions and interfaces
│   └── utils/          # General utility functions (logging, reporting, spinner, levenshtein)
├── tests/              # Unit and integration tests
│   ├── config/         # Tests for configuration modules
│   ├── fixtures/       # Test data files (e.g., sample configs)
│   └── scanners/       # Tests for scanner modules
├── .gitignore          # Files/directories ignored by Git
├── .npmignore          # Files/directories ignored when publishing to npm
├── eslint.config.js    # ESLint configuration
├── package.json        # Project metadata, scripts, and dependencies
├── package-lock.json   # Exact dependency versions
├── tsconfig.json       # TypeScript compiler configuration
├── tsup.config.ts      # Tsup build tool configuration
└── vitest.config.ts    # Vitest testing framework configuration
```

## Directory Purposes

**`src/`:**
- Purpose: Contains all the primary source code for the application. This is where the core logic, commands, configurations, and utilities reside.
- Contains: TypeScript files (`.ts`).
- Key files: `src/index.ts` (main entry point).

**`src/commands/`:**
- Purpose: Houses the implementation of each command exposed by the CLI tool. Each file represents a specific command (e.g., `scan`, `audit`, `fix`).
- Contains: TypeScript files that define command-line actions and their orchestrating logic.
- Key files: `src/commands/scan.ts`, `src/commands/audit.ts`, `src/commands/fix.ts`.

**`src/config/`:**
- Purpose: Manages all aspects of project configuration, including detecting configuration files, parsing their contents, and writing changes back.
- Contains: Modules for configuration detection, parsing different formats (e.g., TOML via `smol-toml` dependency), path resolution, and writing.
- Key files: `src/config/detector.ts`, `src/config/parser.ts`, `src/config/writer.ts`, `src/config/paths.ts`.

**`src/data/`:**
- Purpose: Stores static, read-only data used by the scanners, such as lists of known malicious patterns, official servers, or secret regex patterns.
- Contains: TypeScript files exporting arrays or objects of constant data.
- Key files: `src/data/known-malicious.ts`, `src/data/official-servers.ts`, `src/data/secret-patterns.ts`.

**`src/scanners/`:**
- Purpose: Contains the core logic for various scanning capabilities. Each file implements a specific type of scan (e.g., AST analysis, secret detection, package registry checks).
- Contains: TypeScript files implementing individual scanner functions.
- Key files: `src/scanners/secret-scanner.ts`, `src/scanners/typosquat-scanner.ts`, `src/scanners/ast-scanner.ts`.

**`src/types/`:**
- Purpose: Centralizes all TypeScript interface and type definitions. This ensures consistency and type safety across the entire codebase.
- Contains: TypeScript files exporting types and interfaces.
- Key files: `src/types/config.ts`, `src/types/scan-result.ts`, `src/types/severity.ts`.

**`src/utils/`:**
- Purpose: Provides a collection of general-purpose utility functions that are reused across different parts of the application and do not belong to a specific business domain.
- Contains: Modules for logging, reporting, spinner animations, string algorithms (e.g., Levenshtein distance).
- Key files: `src/utils/logger.ts`, `src/utils/reporter.ts`, `src/utils/spinner.ts`, `src/utils/levenshtein.ts`.

**`tests/`:**
- Purpose: Stores all unit, integration, and end-to-end tests for the application. The structure generally mirrors the `src/` directory.
- Contains: TypeScript test files (`.test.ts`).
- Key files: `tests/e2e.test.ts`, `tests/scanners/secret-scanner.test.ts`, `tests/config/parser.test.ts`.

## Key File Locations

**Entry Points:**
- `src/index.ts`: The main entry point for the entire CLI application.

**Configuration:**
- `package.json`: Project manifest, scripts, and dependency management.
- `tsconfig.json`: TypeScript compiler settings for the project.
- `eslint.config.js`: ESLint configuration for code linting.
- `vitest.config.ts`: Configuration for the Vitest testing framework.
- `tsup.config.ts`: Configuration for the tsup build tool.

**Core Logic:**
- `src/scanners/`: Contains the primary scanning algorithms.
- `src/commands/`: Orchestrates the execution of scans and other CLI actions.

**Testing:**
- `tests/`: Root directory for all test files.

## Naming Conventions

**Files:**
- **Source files (`.ts`):** `kebab-case` (e.g., `secret-scanner.ts`, `json-reporter.ts`).
- **Test files (`.test.ts`):** `kebab-case` matching the source file, with `.test` suffix (e.g., `secret-scanner.test.ts`).

**Directories:**
- **Source directories:** `kebab-case` (e.g., `src/commands`, `src/scanners`, `src/utils`).

## Where to Add New Code

**New CLI Command (e.g., `mcp-scan new-command`):**
- Primary code: Create a new file `src/commands/new-command.ts` and add its definition to `src/index.ts`.
- Tests: Create `tests/new-command.test.ts`.

**New Scanner Type:**
- Implementation: Create a new file `src/scanners/new-scanner.ts`.
- Tests: Create `tests/scanners/new-scanner.test.ts`.
- Integration: Update `src/commands/scan.ts` or other relevant command files to incorporate the new scanner.

**New Utility Function(s):**
- Implementation: Create a new file `src/utils/new-utility.ts` (or add to an existing relevant utility file).
- Tests: Create `tests/utils/new-utility.test.ts`.

**New Type/Interface Definition:**
- Implementation: Create a new file `src/types/new-type.ts` or add to an existing relevant type file (e.g., `src/types/config.ts`).

**New Static Data/Patterns:**
- Implementation: Create a new file `src/data/new-data.ts` or add to an existing relevant data file.

## Special Directories

**`.planning/`:**
- Purpose: Stores all AI-generated planning documents, including codebase analysis, project requirements, roadmaps, and phase-specific plans.
- Generated: Yes
- Committed: Yes

**`dist/`:**
- Purpose: Contains the compiled JavaScript output of the TypeScript source code, ready for distribution or execution.
- Generated: Yes (by `tsup`)
- Committed: No (typically excluded via `.gitignore`).

**`node_modules/`:**
- Purpose: Stores all third-party dependencies installed via `npm` or `yarn`.
- Generated: Yes (by package manager)
- Committed: No (typically excluded via `.gitignore`).

---

*Structure analysis: 2024-06-03*
