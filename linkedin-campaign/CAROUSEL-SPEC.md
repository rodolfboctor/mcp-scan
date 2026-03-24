# LinkedIn Carousel Spec — mcp-scan

## Format
- Platform: LinkedIn Document Post (uploaded via "Add a document" button)
- Design resolution: 2160x2700px per slide (2x for retina quality)
- Display resolution: 1080x1350px (4:5 portrait ratio)
- Slides: 10
- File format: PDF
- Max file size: 5MB
- Export: PDF, all slides on separate pages

## Why 2x?
LinkedIn compresses PDF uploads. Designing at 1x (1080x1350) results in blurry text on retina screens. Design at 2x (2160x2700), export at that size, and LinkedIn's compression will downscale to a crisp 1080x1350.

---

## Color Palette (exact hex)
| Token | Hex | Use |
|-------|-----|-----|
| Background | #000000 | Every slide background |
| Primary text | #F5F5F7 | Headlines, key content |
| Accent | #339DFF | CTAs, key highlights (use sparingly) |
| Secondary text | #86868B | Body copy, descriptions |
| Code background | #1D1D1F | All code blocks |
| Code text | #F5F5F7 | Code content |
| Danger | #FF453A | Critical findings, exposed values |
| Success | #30D158 | Passed checks, positive outcomes |

---

## Typography (at 2x — 2160px wide canvas)
| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|----------------|
| Headlines | Inter | 88px | 600 | -0.02em |
| Subheadings | Inter | 56-64px | 500 | 0 |
| Body | Inter | 56px | 400 | 0 |
| Body line-height | — | 1.5 | — | — |
| Code | JetBrains Mono | 48px | 400 | 0 |
| Captions | Inter | 36px | 400 | 0 |
| MINIMUM size | — | 48px | — | — |

---

## Layout Rules
- Left-aligned text throughout (never centered except code blocks)
- Left/right padding: 160px (80px at 1x)
- Safe zone top/bottom: 200px (100px at 1x)
- CRITICAL: Keep all content above 240px from bottom (120px at 1x) — LinkedIn overlays playback controls
- Whitespace: Generous. When unsure, add more.
- One idea per slide. If you need to cut, cut.
- Max words per slide: 25-30

---

## Code Block Style (at 2x)
- Background: #1D1D1F
- Border-radius: 32px
- Padding: 64px
- No line numbers
- Syntax colors: strings → #30D158, keywords → #339DFF, danger values → #FF453A

---

## Slide Content (2x values)

### Slide 1 — Hook
- Left-aligned, vertically centered
- "I found an exposed API token" — #F5F5F7, 88px, Inter 600
- "in my own AI setup." — #F5F5F7, 88px, Inter 600
- 80px gap
- "Nobody told me to check." — #86868B, 56px, Inter 400

### Slide 2 — The Problem
- "Everyone's adding MCP servers." — #F5F5F7, 88px
- "Nobody's checking the configs." — #86868B, 56px, 48px below
- Code block (96px below): JSON with OPENAI_KEY value in #FF453A

### Slide 3 — Scale
- "Every AI tool stores configs." — #F5F5F7, 88px
- 3 file paths — #86868B, 56px, 72px gap between
- "All unaudited. All containing secrets." — #339DFF, 56px, 96px below paths

### Slide 4 — What Lives In Configs
- "What's in those files?" — #F5F5F7, 88px
- 4 bullet items, #FF453A bullet (●), #86868B text, 56px, 64px gap between

### Slide 5 — Scanner List
- "8 scanners. One command." — #F5F5F7, 88px
- 6 rows: #339DFF dot (16px) + #F5F5F7 label 44px bold + " — " + #86868B desc 40px
- 48px gap between rows

### Slide 6 — One Command
- "One command. Zero config." — #F5F5F7, 88px
- Terminal block: centered, #1D1D1F bg, 32px radius, "$ npx mcp-scan" in #30D158, 64px mono
- 2 lines of mock output below terminal, 32px mono

### Slide 7 — Product Shot
- Full terminal frame: #1D1D1F bg, 2px #333 border, 32px radius
- Finding card: CRITICAL badge (#FF453A), title (#F5F5F7), description (#86868B), remediation (#339DFF)
- Summary line: #86868B mono, bottom of frame

### Slide 8 — Why Now
- "New attack surface." — #F5F5F7, 88px
- 3 statements — #86868B, 56px, 80px gap
- Last statement — #339DFF, 56px

### Slide 9 — Credibility
- "Open source. MIT license." — #F5F5F7, 88px
- 3 large facts — #F5F5F7, 64px, Inter 600, 96px gap
- Support line — #86868B, 44px

### Slide 10 — CTA
- "Check yours." — #F5F5F7, 96px, Inter 600
- "npx mcp-scan" — #339DFF, 72px, JetBrains Mono, 64px below
- "Open source on GitHub. Search mcp-scan." — #86868B, 56px, 96px below
- "What's in your MCP configs right now?" — #86868B, 48px italic, 80px below
- A/B/C options — #86868B, 44px, 32px gap
- "Rodolf Boctor" — #86868B, 36px, bottom-right, 96px from edges

---

## PDF Export Instructions (Figma)
1. Select all frames
2. Export → PDF
3. Resolution: 2x (this produces 2160x2700px per slide)
4. Verify file size under 5MB
5. Open PDF, spot-check: text sharp on slide 1 and 10, code legible on slides 2 and 6

## PDF Export Instructions (other tools)
- Set canvas to 2160x2700px per slide
- Export as PDF at 100% scale
- If exporting from browser (HTML): use window.print() with @page { size: 2160px 2700px }

## LinkedIn Upload
1. Go to linkedin.com/feed
2. Click "Start a post"
3. Click document icon ("Add a document") — NOT the image icon
4. Upload PDF
5. LinkedIn will ask for a document title: "mcp-scan — Security Scanner for MCP Configs"
6. Paste post copy from linkedin-post.md
7. Schedule for 9:30 AM ET, Tuesday March 24, 2026
