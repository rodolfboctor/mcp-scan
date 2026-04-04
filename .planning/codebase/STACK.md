# Technology Stack

**Analysis Date:** 2024-05-15

## Languages

**Primary:**
- TypeScript 5.4.5 - Used for all source code (`src/**/*.ts`) and configuration files (`tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`).

## Runtime

**Environment:**
- Node.js >=18 - Declared in `package.json` engines.

**Package Manager:**
- npm - Used for dependency management and scripts (e.g., `npm run build`).
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Commander.js ^12.0.0 - Used for building command-line interfaces (`src/commands/`).

**Testing:**
- Vitest ^1.5.0 - Used for unit and integration testing.
  - Config: `vitest.config.ts`

**Build/Dev:**
- tsup ^8.0.2 - Used for bundling and compiling TypeScript (`tsup.config.ts`).
- ESLint ^10.1.0 - Used for code linting (`eslint.config.js`).
- TypeScript ^5.4.5 - Primary language compiler.

## Key Dependencies

**Critical:**
- `commander` ^12.0.0 - Core for CLI command parsing and execution.
- `ora` ^8.0.1 - Provides elegant terminal spinners, crucial for user experience in a CLI tool.
- `smol-toml` ^1.6.1 - Used for parsing TOML configuration files (e.g., `tests/config/toml-parser.test.ts`).
- `zod` ^3.23.8 - Used for schema validation, likely for configurations or data structures.

**Infrastructure:**
- `chalk` ^5.3.0 - Provides terminal string styling, improving CLI output readability.
- `cli-table3` ^0.6.4 - Used for displaying data in tabular format in the terminal.

## Configuration

**Environment:**
- Not explicitly configured via `.env` files. Environment variables are checked dynamically within `src/scanners/secret-scanner.ts` (e.g., `process.env`).
- Key configurations for the scanner are found in `src/config/`.

**Build:**
- `tsconfig.json` - TypeScript compiler configuration.
- `tsup.config.ts` - tsup build configuration.
- `eslint.config.js` - ESLint linting configuration.
- `vitest.config.ts` - Vitest testing configuration.

## Platform Requirements

**Development:**
- Node.js (version >=18)
- npm

**Production:**
- Node.js (version >=18) runtime environment for CLI execution.

---

*Stack analysis: 2024-05-15*