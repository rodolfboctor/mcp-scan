# Testing

## Framework
- **Vitest**: Fast, Vite-native testing framework.

## Structure
- Tests are located in the `tests/` directory.
- `tests/scanners/`: Unit tests for each security scanner.
- `tests/config/`: Tests for detection and parsing logic.
- `tests/e2e.test.ts`: End-to-end tests that run the full scan orchestration on test fixtures.

## Patterns
- **Fixtures**: `tests/fixtures/` contains sample JSON and TOML configuration files (valid, vulnerable, malicious) to test various scan scenarios.
- **Mocking**: Testing detection logic often involves checking how the tool handles non-existent or differently structured files.

## Automation
- **GitHub Actions**: CI pipeline (`.github/workflows/ci.yml`) runs tests and linting on every push and pull request across multiple Node.js versions (18.x, 20.x).
