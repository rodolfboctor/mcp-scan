# Contributing to mcp-scan

Thank you for your interest in contributing to mcp-scan. This document provides guidelines for setting up your environment and submitting changes.

## Development setup

Follow these steps to get started with the codebase:

```bash
git clone https://github.com/rodolfboctor/mcp-scan.git
cd mcp-scan
npm install
npm test        # Run vitest unit tests
npm run build   # Compile TypeScript via tsup
node dist/index.js  # Perform a smoke test
```

## Project structure

The repository is organized as follows:

- `src/commands/`: CLI command implementations (scan, fix, watch, audit).
- `src/scanners/`: Individual security scanner modules.
- `src/config/`: Configuration detection and parsing logic.
- `src/types/`: TypeScript interfaces and Zod schemas.
- `src/utils/`: Shared utilities (logger, reporter, generators).
- `src/data/`: CVE snapshots and malicious package blocklists.
- `tests/`: Comprehensive test suite grouped by component.

## Code style

We maintain high standards for code quality:

- **TypeScript strict mode**: All code must pass strict type checking. No `any` types allowed.
- **Dependency injection**: Pass system dependencies (fs, os, process) to functions. This ensures testability without mocking globals.
- **Named exports**: Use named exports for all modules.
- **File size**: Keep files under 200 lines. Split logic into smaller modules when necessary.

## Adding a scanner

1. Create a new file in `src/scanners/`.
2. Export a function that accepts a `ResolvedServer` and returns an array of `Finding` objects.
3. Register the scanner in `src/commands/scanners.ts`.
4. Add comprehensive tests in `tests/scanners/` covering various edge cases.

## Pull request process

1. Create a new branch for your changes.
2. Ensure all tests pass by running `npm test`.
3. Verify the build succeeds with `npm run build`.
4. Update `CHANGELOG.md` if your change is user-facing.
5. Submit a PR with a clear description of the problem and your solution.

## Commit style

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New functionality.
- `fix:` Bug fix.
- `docs:` Documentation updates.
- `test:` Adding or fixing tests.
- `refactor:` Code changes that neither fix a bug nor add a feature.
- `chore:` Maintenance tasks or dependency updates.

Keep the first line under 72 characters and be specific about the changes.

## Security

If you discover a security vulnerability, please refer to our [SECURITY.md](SECURITY.md) for reporting instructions. Do not open public issues for security vulnerabilities.
