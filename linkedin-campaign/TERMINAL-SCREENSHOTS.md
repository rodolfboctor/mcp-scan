# Terminal Screenshot Specs — mcp-scan

Two screenshots needed. These go in the carousel (slides 6-7), Twitter thread (tweets 3-4), and standalone tweet.

---

## Screenshot 1 — Full scan output

**Used in:** Carousel slides 6-7, Twitter tweet 4

**Setup:**
1. Open iTerm2
2. Set up a "Presentation" profile: Preferences → Profiles → + → Name it "Clean"
   - Font: JetBrains Mono 16px
   - Background: #000000
   - Foreground: #F5F5F7
   - Hide tab bar, title bar, window border
3. Run: `npx mcp-scan`
4. Make sure your Claude Desktop or Cursor config has a test key that triggers a CRITICAL finding
   (You can temporarily add a fake key like `OPENAI_KEY=sk-proj-test123` to trigger the scanner)

**What to capture:**
- The full mcp-scan header box
- At least one CRITICAL finding card (severity badge, description, file path)
- The summary line at the bottom

**Screenshot command (pixel-perfect crop):**
```
screencapture -R 0,0,900,600 mcp-scan-full.png
```
Adjust coordinates to tightly frame the terminal content.

**Post-processing:**
- Add 32px pure black (#000000) padding on all 4 sides
- Remove any personal file paths (replace with ~/.claude/claude_desktop_config.json)
- Export at 2x resolution for retina clarity

---

## Screenshot 2 — Single finding close-up

**Used in:** Twitter tweet 3, standalone tweet

**What to capture:**
- Crop to show exactly ONE CRITICAL finding card
- Show: severity badge (CRITICAL in red), finding title, description, file path, remediation hint
- Nothing else — pure signal

**Command:**
```
screencapture -R [x],[y],[w],[h] mcp-scan-finding.png
```
Adjust to tightly crop around the single finding card.

---

## What a Good Screenshot Looks Like

```
┌─────────────────────────────────────────────────────┐
│                    mcp-scan v1.0.2                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ✗ CRITICAL   Exposed Secret                         │
│  ─────────────────────────────────────────────────   │
│  GitHub token found in plaintext                     │
│  ~/.claude/claude_desktop_config.json                │
│                                                       │
│  GITHUB_TOKEN: ghp_xxxxxxxxxxxxxxxxxxxx              │
│                                                       │
│  Fix: Move to environment variable or                │
│       use a secrets manager                          │
│                                                       │
├─────────────────────────────────────────────────────┤
│  1 critical · 0 high · 0 medium · 3 passed           │
└─────────────────────────────────────────────────────┘
```

Colors:
- "CRITICAL" badge: #FF453A background or text
- Finding title: #F5F5F7
- File path and description: #86868B
- The exposed key value: #FF453A
- Summary line: #30D158 for "passed" counts, #FF453A for critical count

---

## Quick Option: Use the Carousel Mock

If you don't have time to set up the terminal screenshot tonight, the carousel slide 7 terminal mockup can serve as the Twitter image. It's a designed version of the same thing. Not ideal (a real screenshot is more credible) but works for launch day.
