---
phase: quick/260323-q6g-fix-config-dedup-bug-per-tasks-dedup-fix
plan: 260323-q6g
subsystem: config
tags: [bugfix, deduplication]
tech-stack: [Node.js, TypeScript, path.resolve()]
key-files: [src/config/detector.ts, tests/config/detector.test.ts, package.json]
requirements: [DEDUP-01]
duration: 10m
---

# Phase quick-260323-q6g-fix-config-dedup-bug-per-tasks-dedup-fix Plan 260323-q6g: Fix Config Dedup Bug Summary

## Objective
Fix the config deduplication bug where running `mcp-scan` from the user's home directory (`~`) detects the same config file twice, causing false `duplicate-server` findings.

## Key Changes
- Modified `src/config/detector.ts` to use `path.resolve()` on all config paths.
- Introduced a `seenPaths` Set to track and skip duplicate configuration files during detection.
- Updated `tests/config/detector.test.ts` with a regression test to ensure each file is only detected once.
- Bumped version in `package.json` to `1.0.4`.

## Verification Results
- **Automated Tests:** All 47 tests passed, including the new regression test.
- **Manual Verification:** Running `node dist/index.js` from the home directory (`~`) no longer detects the same config file twice. False `duplicate-server` findings for files like `~/.codex/config.toml` are gone.

## Self-Check: PASSED
- [x] `src/config/detector.ts` deduplicates paths using `path.resolve()`.
- [x] `tests/config/detector.test.ts` includes a test for deduplication.
- [x] `package.json` version is updated to `1.0.4`.
- [x] `npm test` passes all tests.
- [x] Manual check confirms no duplicate findings from home directory.

## Commits
- `8737892`: fix(detector): deduplicate configs that resolve to the same file path
- `f0d11bf`: chore: bump version to 1.0.4
