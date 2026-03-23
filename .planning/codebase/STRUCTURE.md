# Structure

## Directory Layout
- `src/`: Main source code
    - `commands/`: CLI command implementations
    - `config/`: Configuration file detection and parsing
    - `data/`: Static security data (regex, blocklists)
    - `scanners/`: Core security scanning logic
    - `types/`: TypeScript interface definitions
    - `utils/`: Common utilities (logging, reporting, etc.)
- `tests/`: Test suite
    - `fixtures/`: Sample configuration files for testing
    - `scanners/`: Unit tests for individual scanners
    - `config/`: Tests for detection and parsing
- `dist/`: Compiled output (built by `tsup`)
- `.planning/`: GSD project management and codebase mapping

## Key Files
- `src/index.ts`: CLI entry point
- `src/commands/scan.ts`: Main orchestration logic for scanning
- `src/utils/reporter.ts`: Primary terminal output formatter
- `package.json`: Project metadata and dependencies
- `tsup.config.ts`: Build configuration
- `vitest.config.ts`: Test configuration
