# ugig.net Integration — Phase 1

**Context:** ralyodio (Anthony Ettinger, profullstack.com) runs ugig.net/mcp, an MCP server marketplace.
He integrated mcp-scan and wants a collaboration. Phase 1 is the simplest possible version:
when a scan is clean, show a subtle nudge to list verified servers on ugig.net.

No external API. No dependencies. No maintenance. Fully optional to the user. Just a URL in the output.

---

## What to build

One small change to the reporter + one optional CLI flag. That's it.

---

## Task 1: Clean report ugig.net nudge

**File:** `src/utils/reporter.ts`

In the "all clear" branch of `printReport` (currently around line 88-89), add a subtle second line
after the "All clear" message:

**Before:**
```typescript
logger.log(passGreen(`  ✓ All clear`) + dim(` — ${total} server${total !== 1 ? 's' : ''} scanned in ${ms}ms`));
```

**After:**
```typescript
logger.log(passGreen(`  ✓ All clear`) + dim(` — ${total} server${total !== 1 ? 's' : ''} scanned in ${ms}ms`));
logger.emptyLine();
logger.log(dim(`  All servers verified clean. List them on `) + chalk.hex('#339DFF').dim('ugig.net/mcp') + dim(' →'));
```

This only shows when there are zero findings across all servers. If anything fails, no ugig.net mention.

**Design intent:**
- `ugig.net/mcp` in brand blue (#339DFF) — same color as ThynkQ, intentional
- dim weight throughout — present but not shouting
- The `→` arrow is a subtle call-to-action
- It reads as a service to the user ("your servers are clean, here's where to publish them")

---

## Task 2: Optional --ugig flag

**File:** `src/index.ts` (or wherever the `scan` command options are defined)

Add a `--ugig` boolean flag to the scan command:

```typescript
.option('--ugig', 'Show ugig.net marketplace link for verified servers')
```

**File:** `src/commands/scan.ts`

Pass the flag through to `runScan`:
```typescript
export async function runScan(options: {
  silent?: boolean,
  json?: boolean,
  verbose?: boolean,
  severity?: string,
  fix?: boolean,
  config?: string,
  ugig?: boolean   // ADD THIS
} = {}): Promise<ScanReport>
```

**File:** `src/utils/reporter.ts`

Update `printReport` signature to accept `ugig` option:
```typescript
export function printReport(report: ScanReport, options: { ugig?: boolean } = {})
```

Change the clean-report nudge (Task 1) to only show when `options.ugig` is true OR when there are no findings:

```typescript
// Show ugig nudge: always when all-clear (subtle discovery), or explicitly with --ugig flag
const showUgig = parts.length === 0; // always show on clean scan
if (showUgig || options.ugig) {
  logger.emptyLine();
  logger.log(dim(`  All servers verified clean. List them on `) + chalk.hex('#339DFF').dim('ugig.net/mcp') + dim(' →'));
}
```

This means:
- `mcp-scan` (clean result) → shows the ugig line automatically, subtly
- `mcp-scan` (has issues) + `--ugig` → still shows ugig line (user explicitly asked)
- `mcp-scan` (has issues) → no ugig mention at all

---

## Task 3: Update CLI reference in README

**File:** `README.md`

Add `--ugig` to the CLI reference section:

```bash
mcp-scan                        # Scan all detected configs
mcp-scan --config path/to/file  # Scan a specific config
mcp-scan --json                 # JSON output for pipelines
mcp-scan ci                     # CI mode (strict exit codes)
mcp-scan --ugig                 # Show ugig.net marketplace link for verified servers
```

---

## Task 4: Update README Integrations table

**File:** `README.md`

The integrations table currently has:
```
| ugig.net | MCP marketplace | ugig.net/mcp |
```

Upgrade it slightly:
```
| **ugig.net** | MCP marketplace — browse and list verified servers | [ugig.net/mcp](https://ugig.net/mcp) |
```

---

## Verification

```bash
npm run build
npm test
node dist/index.js           # if clean: should show ugig.net line at bottom
node dist/index.js --ugig    # same but explicit
node dist/index.js --json    # JSON output should NOT include any ugig reference (it's display only)
```

---

## GSD Workflow

Use the GSD quick workflow:
1. Read `~/.gemini/get-shit-done/workflows/quick.md`
2. Execute Task 1, verify build passes, commit
3. Execute Task 2, verify build passes, commit
4. Execute Task 3 + 4 together (both README), commit
5. Update `.planning/STATE.md`

## Commit messages

```
feat(reporter): show ugig.net nudge on clean scan results
feat(scan): add --ugig flag for explicit marketplace link
docs: add --ugig to CLI reference and update integrations table
```

Author: `Abanoub Rodolf Boctor <abanoub.rodolf@gmail.com>`
No AI attribution in commits, comments, or code.

---

## Reply to Anthony's GitHub comment (after this ships)

Post this on issue #1 once the code is merged:

> Shipped in v1.0.3. When mcp-scan finds all your servers clean, it now links directly to ugig.net/mcp.
> Users can also run `mcp-scan --ugig` explicitly.
>
> Once you have an API endpoint for server submission, I can add a `mcp-scan --submit` flag that
> POSTs verified server data directly to ugig.net. Let me know when you have the spec.
