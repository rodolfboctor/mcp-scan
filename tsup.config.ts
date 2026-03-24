import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm'],
    target: 'es2022',
    clean: true,
    dts: true,
    minify: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
    outDir: 'dist',
    noExternal: ['chalk', 'ora', 'cli-table3'], // Bundle these for the CLI
  },
  {
    entry: {
      lib: 'src/lib.ts',
    },
    format: ['esm', 'cjs'],
    target: 'es2022',
    dts: true,
    minify: true,
    outDir: 'dist',
    noExternal: ['chalk', 'ora', 'cli-table3', 'fast-glob', 'smol-toml', 'vuln-vects'], // Bundle everything for the library to be standalone
  }
]);
