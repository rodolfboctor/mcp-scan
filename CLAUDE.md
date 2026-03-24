# mcp-scan — Project Rules

## NO DEV SERVER. THIS IS A CLI TOOL.

**NEVER use preview_start, preview_screenshot, preview_snapshot, or any preview_* tools in this project.**

mcp-scan is a Node.js CLI security scanner published to npm. It has no web UI, no browser, no dev server. There is nothing to preview.

## Verification

After any code change, verify like this:
```bash
npm run build          # TypeScript compile
npm test               # Jest unit tests
node dist/index.js     # Manual smoke test
```

That's it. No browser. No server. No preview tools.

## Stack

- Runtime: Node.js + TypeScript
- Build: `npm run build` (tsc)
- Tests: `npm test` (Jest)
- Entry: `dist/index.js`
- Publish: npm package `mcp-scan`

## Commit author

```
git config user.name "Abanoub Rodolf Boctor"
git config user.email "abanoub.rodolf@gmail.com"
```
