# Conventions

## Code Style
- **TypeScript**: Strict typing is preferred, though `any` is occasionally used in parsers (configured to allow in ESLint).
- **ESM**: Using ECMAScript Modules for modern Node.js development.
- **Naming**: camelCase for variables and functions, PascalCase for interfaces and types.
- **Linting**: ESLint with `typescript-eslint` recommended rules.

## Error Handling
- **Graceful Failure**: CLI commands should handle errors (e.g., file not found, malformed JSON) without crashing, usually by logging a warning via `logger.warn` and returning `null` or an empty list.
- **Atomic Operations**: `src/config/writer.ts` uses atomic writes (write to temp file, then rename) to prevent configuration corruption.

## Patterns
- **Pure Scanner Functions**: Scanners are generally side-effect free, taking input and returning findings.
- **Reporter/Logger Separation**: Business logic is separated from the visual representation of results.
