import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    clean: true,
    dts: true,
    minify: true,
    shims: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
    outDir: 'dist',
    // Removed noExternal to avoid dynamic require issues with built-ins in bundled ESM
  },
  {
    entry: {
      lib: 'src/lib.ts',
    },
    format: ['esm', 'cjs'],
    target: 'node18',
    platform: 'node',
    dts: true,
    minify: true,
    shims: true,
    outDir: 'dist',
    // Removed noExternal
  },
  {
    entry: {
      action: 'action/src/action.ts',
    },
    format: ['cjs'],
    target: 'node20',
    platform: 'node',
    dts: false,
    minify: true,
    shims: true,
    outDir: 'action/dist',
    noExternal: ['@actions/core', 'chalk', 'ora', 'cli-table3', 'fast-glob', 'smol-toml', 'vuln-vects'],
  }
]);
