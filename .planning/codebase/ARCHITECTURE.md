# Architecture

## Core Patterns
- **Modular Scanners**: Security logic is encapsulated in independent scanner functions in `src/scanners/`.
- **Centralized Command Execution**: The `scan` command in `src/commands/scan.ts` orchestrates the detection and scanning process.
- **Data-Driven Detection**: Regex patterns and blocklists are separated into `src/data/`.

## Layers
1. **CLI Entry (`src/index.ts`)**: Uses `commander` to define the command-line interface and route to appropriate command handlers.
2. **Commands (`src/commands/`)**: Contains the high-level logic for each CLI operation (e.g., `scan`, `fix`, `watch`).
3. **Configuration Discovery (`src/config/`)**: Logic for locating, parsing (JSON/TOML), and writing AI tool configurations.
4. **Scanners (`src/scanners/`)**: The core security logic. Each scanner takes a `ResolvedServer` and returns a list of `Finding`s.
5. **Reporters (`src/utils/reporter.ts`, `src/utils/json-reporter.ts`)**: Formats and displays findings to the user in various formats (Table, JSON).

## Data Flow
1. User runs a command (e.g., `mcp-scan`).
2. `detector.ts` finds configuration files on the system.
3. `parser.ts` reads and parses these files into a unified internal representation.
4. `scan.ts` passes each server entry through all enabled scanners in `src/scanners/`.
5. Scanners return `Finding` objects containing severity and recommendations.
6. `reporter.ts` aggregates findings and presents them to the terminal.
