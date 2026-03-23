# Config Dedup Bug Fix — v1.0.4

## The Bug

When `mcp-scan` runs from the user's home directory (`~`), the same config file gets detected twice under different tool names, causing false `duplicate-server` findings.

**Example:** Running `mcp-scan` from `~` detects `~/.codex/config.toml` as both:
- "Codex CLI" (from global tool paths)
- "Project Local" (from project-level path detection, because `cwd/.codex/config.toml` == `~/.codex/config.toml`)

Every server in that file then gets flagged as `duplicate-server` (MEDIUM severity) on the second pass. These are false positives.

## Root Cause

`src/config/detector.ts` has two detection phases:
1. **Global tools** — `getConfigPaths()` returns named tools like "Codex CLI" → `~/.codex/config.toml`
2. **Project local** — `getProjectLevelPaths()` returns `cwd/.codex/config.toml`, `cwd/.gemini/settings.json`, etc.

When `cwd` is `~`, both phases resolve to the same file. No deduplication happens, so the same config appears twice.

## The Fix

**File:** `src/config/detector.ts`

Add `path` import and deduplicate by resolved path. If a project-local config resolves to the same path as an already-detected global tool, skip it.

**Current code:**
```typescript
import fs from 'fs';
import { getConfigPaths, getProjectLevelPaths } from './paths.js';
import { DetectedTool } from '../types/config.js';

export function detectTools(): DetectedTool[] {
  const paths = getConfigPaths();
  const detected: DetectedTool[] = [];

  for (const [name, configPath] of Object.entries(paths)) {
    detected.push({
      name,
      configPath,
      exists: fs.existsSync(configPath)
    });
  }

  // Add project level configs if they exist
  const projectPaths = getProjectLevelPaths();
  for (const configPath of projectPaths) {
    if (fs.existsSync(configPath)) {
      detected.push({
        name: `Project Local`,
        configPath,
        exists: true
      });
    }
  }

  return detected;
}
```

**Fixed code:**
```typescript
import fs from 'fs';
import path from 'path';
import { getConfigPaths, getProjectLevelPaths } from './paths.js';
import { DetectedTool } from '../types/config.js';

export function detectTools(): DetectedTool[] {
  const paths = getConfigPaths();
  const detected: DetectedTool[] = [];
  const seenPaths = new Set<string>();

  for (const [name, configPath] of Object.entries(paths)) {
    const resolved = path.resolve(configPath);
    seenPaths.add(resolved);
    detected.push({
      name,
      configPath: resolved,
      exists: fs.existsSync(resolved)
    });
  }

  // Add project level configs if they exist (skip if already detected as global)
  const projectPaths = getProjectLevelPaths();
  for (const configPath of projectPaths) {
    const resolved = path.resolve(configPath);
    if (seenPaths.has(resolved)) continue;
    if (fs.existsSync(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name: 'Project Local',
        configPath: resolved,
        exists: true
      });
    }
  }

  return detected;
}
```

**Changes:**
1. Added `import path from 'path';`
2. Added `seenPaths` Set to track resolved paths
3. Both phases resolve paths via `path.resolve()` before comparison
4. Project-local phase skips paths already detected as global tools

## Test Plan

The existing tests in `tests/config/detector.test.ts` must still pass.

Add new imports and a new test to verify deduplication. The full updated file should be:
```typescript
import { describe, it, expect } from 'vitest';
import path from 'path';
import { getConfigPaths } from '../../src/config/paths.js';
import { detectTools } from '../../src/config/detector.js';

describe('Detector Paths', () => {
  it('should return a list of paths for different tools', () => {
    const paths = getConfigPaths();
    expect(paths).toHaveProperty('Claude Desktop');
    expect(paths).toHaveProperty('Cursor');
    expect(paths).toHaveProperty('VS Code');
    expect(paths).toHaveProperty('Claude Code');
    expect(paths).toHaveProperty('Windsurf');
  });

  it('should format paths correctly based on string type', () => {
    const paths = getConfigPaths();
    expect(typeof paths['Cursor']).toBe('string');
  });

  it('should not detect same config path under multiple tool names', () => {
    const tools = detectTools();
    const pathCounts = new Map<string, number>();
    for (const tool of tools) {
      const resolved = path.resolve(tool.configPath);
      pathCounts.set(resolved, (pathCounts.get(resolved) || 0) + 1);
    }
    for (const [filePath, count] of pathCounts) {
      expect(count, `${filePath} detected ${count} times`).toBe(1);
    }
  });
});
```

Note: This test verifies the dedup logic works for the current cwd. The real bug manifests when cwd is ~ (home dir), so also verify manually from ~ as described in the Verification section below.

## Verification

```bash
npm run build          # Must compile clean
npm test               # All tests pass (46 existing + 1 new)
node dist/index.js     # Run from project dir — no false duplicates
cd ~ && node /path/to/dist/index.js   # Run from home dir — no false "Project Local" duplicates
node dist/index.js --json  # JSON output should not have duplicate entries for same server
```

**Before fix (from ~):** 1 HIGH + 5 MEDIUM (4 false duplicate-server findings)
**After fix (from ~):** 1 HIGH + 1 MEDIUM (only real findings)

**CRITICAL: The home-dir test is the most important one. The bug ONLY manifests when cwd is ~.**

## Version Bump

Bump `version` in `package.json` from `1.0.3` to `1.0.4`. This is a bugfix release.

## Commit

```
fix(detector): deduplicate configs that resolve to the same file path

When cwd matches home dir, project-local detection re-discovers global
tool configs under "Project Local", causing false duplicate-server
findings. Resolve all paths before comparison and skip already-seen files.
```

Author: `Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>`
No AI attribution in commits, comments, or code.
