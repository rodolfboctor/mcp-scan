# Architecture

**Analysis Date:** 2024-06-03

## Pattern Overview

**Overall:** Modular Command-Line Interface (CLI) Application

**Key Characteristics:**
- **Modular Design:** Clear separation of concerns into distinct directories (commands, scanners, config, utils, types, data).
- **Extensible Scanning Engine:** Core functionality is built around a series of specialized scanners that can be easily added or modified.
- **Configuration-Driven:** Relies on project-specific configuration files for operation.

## Layers

**Entry Point/CLI Layer:**
- Purpose: Handles command-line argument parsing, command dispatching, and orchestration of higher-level flows.
- Location: `src/index.ts`, `src/commands/`
- Contains: `commander.js` setup, top-level command implementations (e.g., `scan`, `audit`, `fix`, `watch`).
- Depends on: Configuration Layer, Scanner Layer, Utility Layer, Type Layer.
- Used by: Users interacting with the CLI.

**Configuration Layer:**
- Purpose: Detects, parses, validates, and writes project configuration files.
- Location: `src/config/`
- Contains: `detector.ts` (finds configs), `parser.ts` (reads and interprets configs), `writer.ts` (saves configs), `paths.ts` (config path utilities).
- Depends on: Utility Layer, Type Layer.
- Used by: Entry Point/CLI Layer, Scanner Layer.

**Scanner Layer:**
- Purpose: Implements the core logic for various security and configuration scans. Each scanner module focuses on a specific type of check.
- Location: `src/scanners/`
- Contains: `ast-scanner.ts`, `config-scanner.ts`, `package-scanner.ts`, `permission-scanner.ts`, `registry-scanner.ts`, `secret-scanner.ts`, `transport-scanner.ts`, `typosquat-scanner.ts`.
- Depends on: Data Layer, Utility Layer, Type Layer, Configuration Layer.
- Used by: Entry Point/CLI Layer.

**Data Layer:**
- Purpose: Provides static data and patterns used by the scanners for their checks.
- Location: `src/data/`
- Contains: `known-malicious.ts` (list of known malicious packages), `official-servers.ts` (list of trusted servers), `secret-patterns.ts` (regex patterns for secrets).
- Depends on: None.
- Used by: Scanner Layer.

**Utility Layer:**
- Purpose: Offers general-purpose helper functions for tasks like logging, reporting, spinning indicators, and string manipulation.
- Location: `src/utils/`
- Contains: `json-reporter.ts`, `levenshtein.ts`, `logger.ts`, `reporter.ts`, `spinner.ts`.
- Depends on: None directly (may use external libraries like `chalk`, `ora`, `cli-table3`).
- Used by: All other layers.

**Type Layer:**
- Purpose: Defines TypeScript interfaces and types for data structures used throughout the application, ensuring type safety and consistency.
- Location: `src/types/`
- Contains: `config.ts` (McpConfig, ResolvedServer, DetectedTool), `scan-result.ts` (ScanReport, Finding, ServerScanResult), `severity.ts` (Severity levels).
- Depends on: None.
- Used by: All other layers.

## Data Flow

**Scan Process Flow:**

1.  **Command Execution:** A user invokes a CLI command (e.g., `mcp-scan scan`).
2.  **Command Orchestration:** The relevant command handler in `src/commands/` (e.g., `runScan` in `src/commands/scan.ts`) is executed.
3.  **Configuration Detection & Parsing:** The command handler uses `src/config/detector.ts` to find configuration files and `src/config/parser.ts` to parse them into structured `McpConfig` and `ResolvedServer` objects (defined in `src/types/config.ts`).
4.  **Scanner Invocation:** The command handler iterates through detected servers/configurations and calls individual scanner functions from `src/scanners/` (e.g., `scanSecrets`, `scanTyposquat`, `scanConfig`).
5.  **Data Lookup:** Scanners may access static data from `src/data/` (e.g., `SECRET_PATTERNS`, `OFFICIAL_SERVERS`) for their checks.
6.  **Issue Identification:** Scanners identify potential issues and create `Finding` objects (defined in `src/types/scan-result.ts`).
7.  **Result Aggregation:** All `Finding` objects are aggregated into a `ScanReport` object (defined in `src/types/scan-result.ts`).
8.  **Reporting:** The aggregated `ScanReport` is then passed to `src/utils/reporter.ts` or `src/utils/json-reporter.ts` for formatted output to the console.

## Key Abstractions

**Scanners:**
- Purpose: Encapsulate specific detection logic for different types of vulnerabilities or misconfigurations. Each scanner is a function that takes configuration/context and returns a list of findings.
- Examples: `src/scanners/secret-scanner.ts`, `src/scanners/typosquat-scanner.ts`
- Pattern: Functional modules, each exported function performs a specific scan.

**Config Management (`McpConfig`, `ResolvedServer`):**
- Purpose: Standardized representation of project configuration and detected servers, facilitating consistent access and manipulation across the application.
- Examples: `src/types/config.ts`, `src/config/parser.ts`
- Pattern: Data transfer objects (DTOs) and dedicated parsing/writing functions.

**Findings and Scan Report (`Finding`, `ScanReport`):**
- Purpose: Standardized data structures for reporting detected issues, including severity, message, and location.
- Examples: `src/types/scan-result.ts`, `src/utils/reporter.ts`
- Pattern: Standardized result objects passed between layers.

## Entry Points

**Main CLI Entry Point:**
- Location: `src/index.ts`
- Triggers: Execution of the `mcp-scan` command from the terminal.
- Responsibilities: Initializes the `commander.js` CLI, defines available commands, and dispatches to their respective `run*` functions in `src/commands/`.

**Command-Specific Entry Points:**
- Location: `src/commands/*.ts` (e.g., `src/commands/scan.ts`, `src/commands/audit.ts`)
- Triggers: Invocation of specific CLI subcommands (e.g., `mcp-scan scan`, `mcp-scan audit`).
- Responsibilities: Orchestrates the logic for a particular command, including config parsing, scanner invocation, and result reporting.

## Error Handling

**Strategy:** Errors are generally caught within command handlers or utility functions, logged using `src/utils/logger.ts`, and often result in a non-zero exit code for CLI operations to indicate failure.

**Patterns:**
- Try-catch blocks in command implementations to gracefully handle failures during configuration parsing or scanning.
- Logging error messages to the console via `logger.error()`.

## Cross-Cutting Concerns

**Logging:** Handled by `src/utils/logger.ts`. Provides colored console output for different log levels (info, warn, error, debug).
**Validation:** Implicitly handled by `src/config/parser.ts` during configuration loading and within individual scanners for specific checks.
**Authentication:** Not directly applicable for this local scanning tool; it does not authenticate with external services for its primary function.

---

*Architecture analysis: 2024-06-03*
