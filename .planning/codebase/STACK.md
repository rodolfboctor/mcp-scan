# Tech Stack

## Core
- **Language**: TypeScript
- **Runtime**: Node.js (>=18)
- **Module System**: ESM (ECMAScript Modules)

## Build & Distribution
- **Bundler**: `tsup` (esbuild-based)
- **Binary**: `mcp-scan` (linked to `dist/index.js`)
- **Distribution**: npm package

## Main Dependencies
- `commander`: CLI command and argument parsing
- `chalk`: Terminal string styling
- `cli-table3`: Creating tables in the terminal
- `ora`: Elegant terminal spinners
- `zod`: TypeScript-first schema validation
- `smol-toml`: TOML parsing for Codex CLI support

## Dev Dependencies
- `vitest`: Unit and E2E testing framework
- `eslint`: Linting with TypeScript support
- `typescript`: Language compiler
- `typescript-eslint`: ESLint tooling for TypeScript
