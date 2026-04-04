# Coding Conventions

**Analysis Date:** 2024-03-27

## Naming Patterns

**Files:**
- `kebab-case` for file names (e.g., `audit.ts`, `json-reporter.ts`). Test files follow `kebab-case.test.ts`.

**Functions:**
- `camelCase` for function names (e.g., `runAudit`, `parseConfig`, `extractServers`).

**Variables:**
- `camelCase` for variable names (e.g., `serverName`, `targetServer`, `configPath`).
- Constants may use `UPPER_SNAKE_CASE` if explicitly defined as constants.

**Types:**
- `PascalCase` for interface and type names (e.g., `McpConfig`, `ResolvedServer`).

## Code Style

**Formatting:**
- Implied by ESLint and TypeScript usage. No explicit Prettier config found.

**Linting:**
- **Tool used:** ESLint with `typescript-eslint`.
- **Key rules:** Uses `tseslint.configs.recommended`.
- **Specific override:** `@typescript-eslint/no-explicit-any` is turned "off" in `eslint.config.js`.

## Import Organization

**Order:**
- Standard ES module imports. Grouping by external modules, internal modules, and then relative paths seems to be the practice.

**Path Aliases:**
- Not explicitly detected. Relative paths are used (e.g., `../utils/logger.js`).

## Error Handling

**Patterns:**
- `try...catch` blocks are used for handling synchronous errors (e.g., file parsing).
- Asynchronous errors are handled with `await` and conditional checks.
- `process.exit(1)` is used for critical failures in command-line tools.
- User-friendly messages are provided via `spinner.fail` or `logger.warn`.

## Logging

**Framework:** `src/utils/logger.ts` for structured logging, `console` for basic output.

**Patterns:**
- `logger.warn` for non-critical issues that should be reported but not stop execution.
- `spinner` (from `src/utils/spinner.ts`) is used for interactive progress updates and success/failure messages.

## Comments

**When to Comment:**
- Not heavily commented in sample files. Comments appear to be used for complex logic or explanations where clarity is not immediate from the code itself.

**JSDoc/TSDoc:**
- No extensive JSDoc/TSDoc blocks observed in sampled files, but type annotations are used for clarity.

## Function Design

**Size:** Functions are generally concise, focusing on a single responsibility.

**Parameters:** Clearly typed.

**Return Values:** Clearly typed, often including `null` for error cases or non-existent resources.

## Module Design

**Exports:**
- Modules typically `export` functions and types directly (e.g., `export function parseConfig(...)`).

**Barrel Files:**
- Not explicitly detected in the `src` root, but `commands`, `config`, `scanners`, `utils` directories export multiple items from a single file (e.g. `src/commands/index.ts` is not present, but `src/commands/audit.ts` exports `runAudit`).

---

*Convention analysis: 2024-03-27*
