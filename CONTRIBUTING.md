# Contributing to mcp-scan

Thank you for your interest in improving `mcp-scan`! We welcome contributions of all kinds.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rodolfboctor/mcp-scan.git
   cd mcp-scan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## Project Structure

- `src/commands/`: CLI command implementations.
- `src/scanners/`: Individual security scanner logic.
- `src/config/`: Configuration detection and parsing.
- `src/types/`: TypeScript interfaces and schemas.
- `src/utils/`: Shared utilities (logger, reporter, etc.).

## Adding a New Scanner

To add a new security scanner:
1. Create a new file in `src/scanners/` (e.g., `my-new-scanner.ts`).
2. Export a function that takes a `ResolvedServer` and returns an array of `Finding`.
3. Register your scanner in `src/commands/scan.ts` in the `allFindings` array.
4. Add comprehensive tests in `tests/scanners/my-new-scanner.test.ts`.

## Pull Request Requirements

- **Tests:** All changes must include corresponding tests.
- **Linting:** Ensure your code follows the project's coding standards.
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/).
- **Documentation:** Update `README.md` or other documentation if applicable.

## Commit Style

We follow the Conventional Commits specification:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code restructuring
- `test:` for adding/fixing tests
- `chore:` for maintenance tasks

---
Built by [Abanoub Rodolf Boctor](https://linkedin.com/in/abanoubrodolf) and [ThynkQ](https://thynkq.com).
