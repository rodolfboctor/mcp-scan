# Testing Patterns

**Analysis Date:** 2024-03-27

## Test Framework

**Runner:**
- Vitest - Latest stable version (inferred from `vitest.config.ts`)
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest's built-in `expect` (compatible with Jest's API).

**Run Commands:**
```bash
vitest                         # Run all tests
vitest --watch                 # Watch mode
vitest run --coverage          # Coverage
```

## Test File Organization

**Location:**
- Test files are co-located in a dedicated `tests/` directory at the project root.
- Subdirectories within `tests/` mirror the `src/` directory structure for logical grouping (e.g., `tests/config/parser.test.ts` for `src/config/parser.ts`).

**Naming:**
- Files follow the pattern `*.test.ts` (e.g., `parser.test.ts`, `e2e.test.ts`).

**Structure:**
```
[project-root]/
├── tests/
│   ├── e2e.test.ts
│   ├── config/
│   │   ├── detector.test.ts
│   │   ├── parser.test.ts
│   │   └── toml-parser.test.ts
│   └── scanners/
│       ├── ast-scanner.test.ts
│       ├── config-scanner.test.ts
│       └── ...
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest';

describe('Config Parser', () => {
  // Setup logic or shared variables for the suite
  const validPath = path.join(__dirname, '../fixtures/valid-config.json');

  it('should successfully parse a valid config', () => {
    // Test case implementation
    const config = parseConfig(validPath);
    expect(config).not.toBeNull();
  });

  it('should return null for non-existent file gracefully', () => {
    // Another test case
    const config = parseConfig('non-existent.json');
    expect(config).toBeNull();
  });
});
```

**Patterns:**
- **Setup pattern:** Local `const` declarations within `describe` blocks for shared test data or paths. No explicit `beforeEach`/`beforeAll` observed in the sample.
- **Teardown pattern:** Not explicitly observed in the sample, suggesting minimal global state modification or reliance on Vitest's isolated test environments.
- **Assertion pattern:** Uses `expect().toBe()`, `expect().not.toBeNull()`, `expect().toHaveProperty()`, `expect().toHaveLength()` for various checks.

## Mocking

**Framework:** Vitest's built-in mocking capabilities.

**Patterns:**
```typescript
// Not explicitly observed in the provided test sample, but Vitest supports:
// import { vi } from 'vitest';
// vi.mock('module-to-mock', () => ({
//   default: vi.fn(() => 'mocked value'),
// }));
```

**What to Mock:**
- External dependencies (e.g., file system operations, network requests, external libraries) to ensure unit tests are isolated and fast. (Inferred)

**What NOT to Mock:**
- Core logic under test; internal functions that are part of the module being tested. (Inferred)

## Fixtures and Factories

**Test Data:**
```typescript
// Fixture files are used for configuration parsing tests
const validPath = path.join(__dirname, '../fixtures/valid-config.json');
// Content is loaded using fs.readFileSync in the parser itself, or directly
// passed as input.
```

**Location:**
- Test fixture files are located in `tests/fixtures/`.

## Coverage

**Requirements:**
- Not explicitly defined in `vitest.config.ts`, but coverage can be generated using `vitest run --coverage`.

**View Coverage:**
```bash
vitest run --coverage
# This typically generates an HTML report in `coverage/` directory.
```

## Test Types

**Unit Tests:**
- The primary focus, testing individual functions and modules in isolation.
- Examples: `tests/config/parser.test.ts`, `tests/scanners/ast-scanner.test.ts`.

**Integration Tests:**
- Tests that combine multiple units or modules to ensure they work together correctly.
- Examples: `e2e.test.ts` likely contains higher-level integration or end-to-end tests.

**E2E Tests:**
- `tests/e2e.test.ts` is present, suggesting end-to-end testing, likely verifying the CLI commands work as expected.

## Common Patterns

**Async Testing:**
```typescript
// Vitest handles async tests natively; simply return a Promise or use async/await.
it('should perform async operation', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

**Error Testing:**
```typescript
// Testing expected error paths
it('should return null for non-existent file gracefully', () => {
  const config = parseConfig('non-existent.json');
  expect(config).toBeNull();
});

// For functions that throw, Vitest/Jest expect:
// expect(() => someFunctionThatThrows()).toThrow('Expected error message');
```

---

*Testing analysis: 2024-03-27*
