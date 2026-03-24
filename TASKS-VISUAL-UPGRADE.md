# Visual Upgrade — mcp-scan CLI Output

**Goal:** Upgrade the terminal output from functional to premium. Think Vercel CLI meets Snyk meets Apple. Every character placement is intentional.

**Author:** Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>
**No AI attribution** in commits, comments, or code.

---

## Design System (colors already in codebase)

```typescript
// These exist in src/utils/logger.ts and src/utils/reporter.ts
const brand    = '#339DFF';  // ThynkQ blue — primary accent
const critical = '#F85149';  // red
const high     = '#F0883E';  // orange
const medium   = '#D29922';  // yellow
const pass     = '#3FB950';  // green
// low = chalk.dim (gray)
// accent gray = '#8B949E' (NEW — add for secondary text)
```

---

## Task 1: Upgrade Header Banner

**File:** `src/utils/reporter.ts`

Replace the current `┌─┐│└─┘` box with rounded corners and brand-colored border. Add version number from package.json.

**Before:**
```
  ┌─────────────────────────────────────────────┐
  │  🛡️  mcp-scan  ·  Security Report             │
  └─────────────────────────────────────────────┘
```

**After:**
```
  ╭──────────────────────────────────────────────╮
  │                                              │
  │   🛡️  mcp-scan  v1.0.2                        │
  │   Security scanner for MCP server configs    │
  │                                              │
  ╰──────────────────────────────────────────────╯
```

**Implementation notes:**
- Border chars: `╭ ╮ ╰ ╯ │ ─` (rounded Unicode box drawing)
- Border color: `chalk.hex('#339DFF')` (brand blue)
- Title `mcp-scan`: `chalk.white.bold`
- Version `v1.0.2`: `chalk.dim` — read from `package.json` using `createRequire` or a static import
- Subtitle line: `chalk.hex('#8B949E')` (accent gray)
- Inner padding: 1 blank line top and bottom for breathing room
- Width: 48 chars inner (50 total with borders)

**How to get version at runtime:**
```typescript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
// Use pkg.version
```

---

## Task 2: Upgrade Server Cards (findings view)

**File:** `src/utils/reporter.ts`

Replace the flat listing with tree-line "card" connectors in brand blue.

**Before:**
```
  Cursor › postmark-mcp
  ~/.cursor/mcp.json

   CRITICAL  known-malicious
             Package 'postmark-mcp' is on the known malicious list.
             ↳ Remove this server immediately.

  ────────────────────────────────────────────────────────────
```

**After:**
```
  ┌ Cursor › postmark-mcp
  │ ~/.cursor/mcp.json
  │
  │  CRITICAL  known-malicious
  │            Package 'postmark-mcp' is on the known malicious list.
  │            ↳ Remove this server immediately.
  │
  │  HIGH      exposed-secret
  │            Exposed GitHub Token in environment variable.
  │            ↳ Move to a secure store.
  │
  └──────────────────────────────────────────────────────
```

**Implementation notes:**
- `┌` top connector: brand blue
- `│` side rail: brand blue dim
- `└─` bottom connector: brand blue dim
- Tool name (`Cursor`): brand blue bold
- Server name (`postmark-mcp`): chalk.white.bold
- Separator `›`: chalk.hex('#8B949E')
- Config path: chalk.dim
- Severity badges: keep existing `criticalBg`, `highBg`, etc. background colors
- Finding ID: chalk.bold
- Description: chalk.white
- Fix recommendation: chalk.dim with `↳` prefix
- Empty line between findings for readability
- Bottom connector: `└` + `─`.repeat(55) in brand dim

---

## Task 3: Upgrade Clean Server List

**File:** `src/utils/reporter.ts`

Add issue count and align output for clean servers.

**Before:**
```
  ✓ Claude Desktop › filesystem
```

**After:**
```
  ✓ Claude Desktop › filesystem            0 issues
  ✓ Claude Code › context7                 0 issues
  ✓ VS Code › copilot-helper               0 issues
```

**Implementation notes:**
- `✓`: chalk.hex('#3FB950').bold (pass green)
- Tool name: regular weight
- `›` separator: chalk.hex('#8B949E')
- Server name: regular weight
- `0 issues`: chalk.dim, right-aligned or padded to column
- Pad server names to align the "0 issues" column (use max name length + padding)

---

## Task 4: Upgrade Summary Section

**File:** `src/utils/reporter.ts`

Replace the single-line summary with a structured block.

**Before:**
```
   2 critical    1 high   ·  5 servers in 12ms
```

**After (when findings exist):**
```
  ──────────────────────────────────────────────────

   Scanned 5 servers across 3 clients in 12ms

    2 critical    1 high    0 medium    0 low

  ──────────────────────────────────────────────────
```

**After (all clear):**
```
  ──────────────────────────────────────────────────

   ✓ All clear — 5 servers scanned in 12ms

  ──────────────────────────────────────────────────
```

**Implementation notes:**
- Dividers: chalk.hex('#339DFF').dim with `─`.repeat(50)
- "Scanned X servers across Y clients in Zms": chalk.white, numbers bold
- Count clients by counting unique `toolName` values from results
- Severity counts: each colored by its severity color. Zero counts are dim.
- "All clear" line: chalk.hex('#3FB950').bold for the checkmark and text, dim for the stats
- Add 1 empty line before and after the summary block for breathing room

---

## Task 5: Upgrade Footer Attribution

**File:** `src/utils/reporter.ts`

Keep the existing co-branding but refine the typography.

**Current:**
```typescript
dim('  by ') + chalk.white.bold('Rodolf') + dim(' · ') + dim('thynk') + brand.bold('Q') + dim('  ') + chalk.hex('#339DFF').dim('thynkq.com')
```

**Updated:**
```typescript
dim('  by ') + chalk.white.bold('Rodolf') + chalk.hex('#8B949E')(' · ') + chalk.hex('#8B949E')('thynk') + chalk.hex('#339DFF').bold('Q') + chalk.hex('#8B949E')('  ') + chalk.hex('#339DFF').dim.underline('thynkq.com')
```

**Changes:**
- Use accent gray `#8B949E` for separators and "thynk" instead of `chalk.dim` (more intentional color)
- Add subtle underline to `thynkq.com` to signal it's a link
- "Q" stays bold brand blue (#339DFF) — this is the ThynkQ logo accent
- "Rodolf" stays white bold — the personal brand
- Everything else is accent gray — not drawing attention but present

---

## Task 6: Upgrade Spinner

**File:** `src/utils/spinner.ts`

Change spinner color from cyan to brand blue.

**Before:**
```typescript
color: 'cyan',
```

**After:**
```typescript
color: 'blue',
```

Note: ora doesn't support hex colors directly for the spinner character. Use `'blue'` which is close enough. The spinner text can be colored with chalk:

```typescript
export const createSpinner = (text: string) => {
  return ora({
    text: chalk.hex('#339DFF')(text),
    color: 'blue',
    spinner: 'dots',
  });
};
```

Import chalk at the top of spinner.ts.

---

## Task 7: Update README Demo Output

**File:** `README.md`

Update the demo output block (lines ~33-58) to match the new visual format. Use the new rounded borders, card connectors, and summary format. Keep it realistic with the same example data.

---

## Task 8: Version Bump

**File:** `package.json`

Bump version to `1.0.3` for this visual upgrade release.

---

## Verification (run after ALL tasks)

```bash
npm run build
npm test
node dist/index.js        # smoke test — should show the new header + footer
node dist/index.js --json  # JSON output should be unaffected
```

**Visual check:** Run `node dist/index.js` and verify:
1. Rounded header box with version number
2. Card-style server findings with blue tree connectors
3. Clean servers show "0 issues"
4. Summary section with client count
5. Footer shows "by Rodolf · thynkQ  thynkq.com"
6. Spinner is blue (run on a config that takes time to scan)

---

## Commit Strategy

One commit per task. Conventional commits:
```
style(reporter): upgrade header to rounded box with version
style(reporter): add card connectors for server findings
style(reporter): align clean server list with issue counts
style(reporter): structured summary section with client count
style(reporter): refine footer attribution colors
style(spinner): brand blue spinner color
docs: update README demo output
chore: bump version to 1.0.3
```

Author: `Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>`
No AI attribution anywhere.
