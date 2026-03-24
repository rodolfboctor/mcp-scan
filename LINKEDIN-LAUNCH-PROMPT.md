# mcp-scan Launch Campaign — Full Autonomous Prompt

Paste this entire prompt into a fresh Claude session.

---

```
You are creating a premium launch campaign for mcp-scan, an open-source CLI security scanner for MCP (Model Context Protocol) server configs.

**Author:** Rodolf Boctor — open-source security engineer. Personal GitHub: github.com/rodolfboctor

**CRITICAL: This is a PERSONAL open-source project. Do NOT reference any company name, brand, or employer anywhere in ANY deliverable. Everything is attributed to "Rodolf Boctor" as an individual developer. Zero company logos, zero company names, zero business branding. This is employment-safe.**

---

## Product Context

mcp-scan catches:
- Exposed API keys and tokens in MCP config files (GitHub tokens, OpenAI keys, Stripe keys)
- Typosquatting attacks (fake package names using homoglyphs like @modeicontextprotocol)
- Known malicious MCP packages (confirmed malware, exfiltration tools)
- Overly broad filesystem permissions (/ instead of ~/projects)
- Reverse shells and exfiltration pipes via AST analysis (cat secrets | curl ...)
- Unencrypted HTTP transport on remote servers
- Registry verification (checks packages against official MCP registries)
- Package version analysis (detects outdated or suspicious versions)

One command: `npx mcp-scan`
GitHub: github.com/rodolfboctor/mcp-scan
npm: npmjs.com/package/mcp-scan
License: MIT
Supports: Claude Desktop, Cursor, VS Code, Windsurf, Zed

Personal story hook: Rodolf ran mcp-scan on his own AI coding setup and found an exposed API token sitting in plaintext inside a config file he'd forgotten he set up months ago.

---

## DESIGN LANGUAGE — Apple-level premium. Non-negotiable.

Every visual must look like it shipped from Apple's marketing team. Study these rules and follow them exactly.

**Color palette (exact hex, no substitutes):**
- Background: #000000 pure black
- Primary text: #F5F5F7 (Apple's off-white)
- Accent: #339DFF (one accent color only, used sparingly for key emphasis)
- Secondary text: #86868B (Apple's gray)
- Code block background: #1D1D1F
- Code text: #F5F5F7
- Danger: #FF453A (Apple's red)
- Success: #30D158 (Apple's green)

**Typography (on 1080px wide canvas):**
- Headlines: Inter 600, 44-48px, letter-spacing -0.02em
- Subheadings: Inter 500, 28-32px
- Body text: Inter 400, 28-32px, line-height 1.5 (NEVER below 28px for mobile readability)
- Code: JetBrains Mono 400, 24px
- Captions/credits: Inter 400, 18px
- HARD RULE: nothing below 24px on any slide. Mobile users are 75%+ of LinkedIn.

**EXPORT RESOLUTION: Design at 2160x2700px (2x), export as PDF. LinkedIn compresses uploads. Designing at 2x ensures text stays sharp on retina and mobile screens after compression. Final logical size is 1080x1350px (4:5 portrait).**

**Layout:**
- Massive whitespace. When in doubt, add more.
- One idea per slide. If you can't read it in 3 seconds, cut it.
- 15-25 words per slide maximum. Headlines 5-10 words.
- Keep all content 100px from edges (safe zone).
- Keep critical content 120px from bottom (LinkedIn overlays controls there).
- No borders on containers. Use subtle background color shifts (#111111 vs #000000) for depth.
- No drop shadows. No gradients. No decorative elements.
- Left-aligned text with generous padding. Not centered.

**Code block styling:**
- Dark terminal aesthetic, 16px border-radius
- 32px internal padding
- Syntax: strings #30D158, keywords #339DFF, danger values #FF453A
- No line numbers

**Apple principles:**
- Product speaks for itself. Minimal text, maximum impact.
- Negative space IS a design element.
- Every pixel intentional. Zero decoration.
- No clipart, no stock illustrations, no emojis in design.

---

## Deliverables — Create ALL of these:

### 1. LinkedIn Carousel — 10 slides (design at 2160x2700px, exports to 1080x1350px portrait, 4:5 ratio)

**Research says 10 slides is the sweet spot.** LinkedIn's algorithm measures swipe completion rate and dwell time. 10 slides at the right density maximizes both signals. Each slide: one idea, under 25 words, readable in 3 seconds.

Create this using Magic Patterns (create_design tool) as a live React component rendering all 10 slides side by side. Use Tailwind for styling. Then also create the detailed spec file.

**Slide 1 — The Hook (text only, pure typography)**
- Line 1 (44px, #F5F5F7, Inter 600): "I found an exposed API token"
- Line 2 (44px, #F5F5F7, Inter 600): "in my own AI setup."
- Line 3 (28px, #86868B, Inter 400, 40px gap above): "Nobody told me to check."
- Text left-aligned, vertically centered, 80px left padding.
- Nothing else. No images, no icons. Typography IS the design.

**Slide 2 — The Problem**
- Headline (44px, #F5F5F7): "Everyone's adding MCP servers."
- Subhead (28px, #86868B): "Nobody's checking the configs."
- Below: a config snippet with an exposed key highlighted in #FF453A. Everything else dimmed to #555.
```json
{
  "env": {
    "OPENAI_KEY": "sk-proj-9xK4m..."
  }
}
```

**Slide 3 — Scale of the Problem**
- Headline (44px, #F5F5F7): "Every AI tool stores configs."
- Three tool names listed (28px, #86868B):
  - "Claude Desktop — ~/.claude/claude_desktop_config.json"
  - "Cursor — ~/.cursor/mcp.json"
  - "VS Code — settings.json"
- Bottom line (28px, #339DFF): "All unaudited. All containing secrets."

**Slide 4 — What Lives in Your Configs**
- Headline (44px, #F5F5F7): "What's in those files?"
- Four items, each on its own line (28px, #86868B), with a #FF453A bullet:
  - Raw API keys in plaintext
  - Package names nobody verified
  - Filesystem paths with full disk access
  - HTTP endpoints sending data unencrypted

**Slide 5 — What It Catches (the scanner list)**
- Headline (44px, #F5F5F7): "8 scanners. One command."
- 6 items (most impactful), single column, 28px between:
  - Each: #339DFF dot (8px) + label (#F5F5F7, 28px) + desc (#86868B, 24px)
  - Exposed secrets — API keys in plaintext
  - Typosquatting — fake package names
  - Malicious packages — confirmed malware
  - Permission abuse — overly broad access
  - Code injection — reverse shells, eval()
  - Insecure transport — HTTP, not HTTPS

**Slide 6 — One Command**
- Headline (44px, #F5F5F7): "One command. Zero config."
- Centered terminal block on #1D1D1F, 16px radius, 32px padding:
```
$ npx mcp-scan
```
- Below: condensed output showing one #FF453A CRITICAL finding and a green summary line

**Slide 7 — What a Real Scan Looks Like**
- Full terminal mockup of mcp-scan output: the header box, one finding card with severity badge and description, and the summary line.
- This is the "product shot" slide. Make it look beautiful.
- Terminal frame: #1D1D1F background, 1px #333 border, 16px radius

**Slide 8 — Why Now**
- Headline (44px, #F5F5F7): "New attack surface."
- Three statements (28px, #86868B), generous spacing:
  - "Claude, Cursor, VS Code, Zed, Windsurf — all use MCP."
  - "Every config is an unaudited entry point."
  - Last line in #339DFF: "No one had tooling for this. Until now."

**Slide 9 — Credibility**
- Headline (44px, #F5F5F7): "Open source. MIT license."
- Three facts, large and spaced (32px, #F5F5F7):
  - "8 scanners"
  - "30+ API key patterns"
  - "5 AI tools supported"
- Bottom: (24px, #86868B): "Works with Claude Desktop, Cursor, VS Code, Windsurf, Zed"

**Slide 10 — CTA**
- Headline (48px, #F5F5F7): "Check yours."
- Code (36px, #339DFF, JetBrains Mono): `npx mcp-scan`
- 48px gap
- (28px, #86868B): "Open source on GitHub. Search mcp-scan."
- 40px gap
- Forced-choice CTA (24px, #86868B italic): "What's in your MCP configs right now?"
- Three options listed (24px, #86868B): "A) Haven't checked  B) Checked and found something  C) Don't use MCP yet"
- Bottom (18px, #86868B): "Rodolf Boctor"

Write the full spec to `linkedin-campaign/CAROUSEL-SPEC.md`: every hex, font size, spacing value, safe zones, PDF export instructions (design at 2160x2700px per slide for 2x sharpness, export as PDF at 1080x1350px per page, file size under 3MB, upload directly to LinkedIn as document post).

---

### 2. LinkedIn Post Copy (1,200-1,500 characters)

Write to `linkedin-campaign/linkedin-post.md`.

**CRITICAL: ZERO links in post body. LinkedIn penalizes posts with external links by an estimated 25-50% reach reduction (some studies claim 60%). Even first-comment links are slightly deprioritized in 2026. Use "search mcp-scan on npm" instead. Drop the actual link in the first comment as backup (include in the file as a separate section).**

**AI-DETECTION WARNING: LinkedIn now reduces reach on content it detects as AI-generated by an estimated 30%, with 55% less engagement. Write in a distinctly HUMAN voice. Include specific personal details only Rodolf would know (the exact config file path, how long the token had been exposed, what he was doing when he found it). Use sentence fragments, casual asides, and imperfect rhythm. NO perfectly structured five-paragraph essays. NO polished marketing cadence. It should read like someone typed it out on their lunch break.**

The post needs to be 1,200-1,500 characters. First 210 characters are the hook (this is what shows before "see more"). Structure:

```
Hook (2 lines, under 210 chars — this shows before "see more"):
I ran a security scan on my own AI coding setup last week. Found an exposed API token sitting in plaintext inside a config I forgot about.

[line break]

Story expansion (2-3 short paragraphs):
Expand on: what it felt like to find it, what the config was, how long it had been sitting there. Make it personal and specific. Then transition to building mcp-scan. Use casual, imperfect rhythm. Sentence fragments are fine. Write like you're telling a friend, not writing a press release.

[line break]

What it does (bullet-style, 3-4 lines):
- Scans every MCP config on your machine
- Checks for exposed secrets, typosquatting, malicious packages
- Catches code injection, permission abuse, insecure transport
- One command. Zero config. Open source.

[line break]

The command (standalone for visual weight):
npx mcp-scan

[line break]

CTA (forced choice — drives 3x more comments than open questions):
What's in your MCP configs right now?
A) Haven't checked
B) Checked and found something
C) Don't use MCP yet

[line break]

Hashtags (3-5 max, 6+ may trigger spam flags):
#mcp #cybersecurity #opensource
```

Refine this into polished copy:
- No em dashes. Use periods, commas, semicolons only.
- No "excited to share", "leveraging", "comprehensive", "cutting-edge"
- Write like a senior engineer in a Slack channel. Peer-to-peer.
- Zero emojis.
- ZERO links in the body.
- The `npx mcp-scan` line must stand alone for visual weight.
- Must sound HUMAN. Include 1-2 details that are clearly personal experience, not template filler.

Also include a **"First Comment"** section at the bottom of the file:
```
First comment (post within 5 minutes of the main post):
"Repo: github.com/rodolfboctor/mcp-scan — MIT license, one command: npx mcp-scan. Works with Claude Desktop, Cursor, VS Code, Windsurf, and Zed."
```

---

### 3. Show HN Post

Write to `linkedin-campaign/show-hn.md`.

**Research data: top Show HN titles average 59 chars (sweet spot 50-79). Need 8-10 upvotes + 2-3 thoughtful comments in first 30 min for front page. Modest language wins. Name competitors in paragraph 1 (category placement, not bragging). Do NOT include roadmap in body (reads as "it doesn't do that yet"). Save roadmap for comment replies.**

Title (60 chars): `Show HN: mcp-scan – security scanner for MCP server configs`

Body (4 paragraphs, 400-600 words):

Paragraph 1: Personal story + category placement. "Hey HN. I built mcp-scan..." + "I ran it on my own setup and found an API token I forgot was there." Then immediately name the landscape: "Snyk acquired Invariant Labs (creators of the original mcp-scan proof of concept) last year. Their version required Python and focused on prompt injection. This is a different tool: pure Node.js CLI, npm install, scans your local configs for the unsexy stuff — leaked secrets, typosquatting, malicious packages, insecure transport." Name the gap you fill.

Paragraph 2: Technical depth, be specific. 8 scanners. AST analysis parses server entry scripts looking for reverse shells (child_process.exec + curl patterns), eval() calls, and data exfiltration pipes. Typosquatting detection uses Levenshtein distance against the official MCP package registries. Secret scanner covers 30+ API key formats (OpenAI, GitHub, Stripe, AWS, etc.) via regex. Config parser supports Claude Desktop, Cursor, VS Code, Windsurf, Zed config formats out of the box. One command: `npx mcp-scan`.

Paragraph 3: Why this matters now. MCP is becoming the standard for AI tool extensibility. Every major IDE and AI assistant now supports it. Each config file contains plaintext secrets, npm package references nobody has verified, filesystem permissions defaulting to root, and HTTP endpoints for remote servers. This is a brand new, completely unaudited attack surface. GitHub link here.

Paragraph 4: Feedback request (NOT roadmap). "Looking for feedback on what scanners would be most useful next. What patterns are you seeing in MCP configs that concern you?" This invites technical discussion without listing unfinished features.

**Also create a "Pre-written first comment" section in the file:**
Post this as your own comment within 5 minutes of submission. 2-3 paragraphs of deeper technical detail that didn't fit the body:
- The hardest engineering challenge (AST analysis across different package manager formats)
- A specific interesting finding from your own testing
- An invitation for specific feedback: "If anyone is running MCP servers with custom transports, I'd love to hear what patterns you're using for auth"

**Tone rules:**
- "Hey HN" opener. One sentence about yourself, then straight to the tool.
- Talk as a fellow builder. Zero superlatives. Zero marketing speak.
- "I built a small tool" > "I built the ultimate solution"
- Name competitors in the first paragraph (this is category placement, not bragging. Bearer got 106 pts doing this)
- Be specific: real numbers, real scanner names, real regex patterns
- GitHub link early in the body, not buried at the bottom
- When people criticize in comments: agree with something first, then explain your tradeoff. Modest wins on HN.
- Do NOT coordinate shill comments. HN's shill ring detection is sophisticated. If friends want to support, they must have established HN accounts, engage at staggered intervals (15+ min apart), and ask genuine technical questions only.

---

### 4. Twitter/X Thread — 7 tweets + standalone backup tweet

Write to `linkedin-campaign/twitter-thread.md`.

**Research data: 5-8 tweets optimal (7 is the sweet spot). Tweets with images get 35-70% more engagement. Post Tuesday-Thursday 9-11 AM EST. Zero or 1 hashtag max. Pin the thread for 7-14 days. X Premium accounts get roughly 10x more reach. If Rodolf has Premium, note it in the playbook. If not, consider the $8/month investment for launch week.**

Structure (60% technical, 40% personal):

- **Tweet 1 (hook, no image):** Personal story in under 100 chars ideally, max 280. The found token. Specific number or detail in first 7 words. End with "Here's what I built."
- **Tweet 2 (what it is):** What mcp-scan does. One sentence. The `npx mcp-scan` command. "8 scanners, zero config, MIT license."
- **Tweet 3 (what it catches, + [IMAGE] marker):** The 6 scanner types as a tight list. Mark where to attach a clean screenshot of the scanner list.
- **Tweet 4 (product shot, + [IMAGE] marker):** "Here's what it looks like when it finds something." Mark where to attach terminal screenshot.
- **Tweet 5 (why now):** MCP is everywhere. Claude, Cursor, VS Code, Zed. Nobody's auditing configs. New attack surface.
- **Tweet 6 (what's next):** v2.0 roadmap. Prompt injection detection, CVE lookup, GitHub Action. Building in public.
- **Tweet 7 (CTA):** "Try it: npx mcp-scan. Star the repo if useful: github.com/rodolfboctor/mcp-scan. What did you find?" GitHub link is fine on Twitter (no penalty).

**Standalone backup tweet (post 2-3 hours AFTER the thread):**
- Single tweet, not a reply. Catches people who skip threads.
- Include a terminal screenshot showing mcp-scan output.
- Different angle from the thread hook. Example: "Every AI tool on your machine has a config file. Most contain plaintext API keys. npx mcp-scan checks them all in 10 seconds." + [IMAGE]
- This should work as a completely standalone post for someone who never saw the thread.

**Rules:**
- 280 chars max per tweet
- Zero hashtags (or max 1: #buildinpublic on tweet 6 only)
- Max 1 emoji per tweet, only if natural
- Direct, technical, peer-to-peer
- Include [IMAGE] markers where screenshots should be attached
- After posting: pin the thread immediately, keep pinned 7-14 days

---

### 5. Launch Playbook

Write to `linkedin-campaign/LAUNCH-PLAYBOOK.md`.

**Tuesday March 24 — Launch Day (replaces the currently scheduled text-only post):**

Cancel the text-only post currently scheduled for March 24 at 8:30 AM. Replace with the carousel version at 9:30 AM.

| Time (ET) | Action | Platform | Notes |
|-----------|--------|----------|-------|
| 8:45 AM | Submit Show HN | HN | 45 min head start for upvotes |
| 9:30 AM | Post carousel + copy | LinkedIn | PDF upload as document post. 9:30 AM mid-morning outperforms 9:00 AM on Tuesdays. |
| 9:32 AM | Post first comment with repo link | LinkedIn | Within 5 min of main post |
| 9:35 AM | Post thread | Twitter/X | Pin immediately after |
| 9:30-10:00 | Reply to EVERY comment | All | First 30 min is make-or-break |
| 12:00 PM | Check HN rank, add technical comment if on front page | HN | |
| 12:30 PM | Reply to afternoon LinkedIn comments | LinkedIn | |
| 6:00 PM | Evening engagement sweep | All | |

**Pre-launch prep (Monday evening, March 23 — TONIGHT):**
- Cancel the currently scheduled text-only LinkedIn post for March 24
- Add GitHub repo URL to LinkedIn profile "Featured" section
- Audit GitHub README (this is your landing page when people click through)
- Check that GitHub social preview image is set (if not, set it)
- Prepare PDF export of carousel (design at 2160x2700px, export at 1080x1350px, under 3MB)
- Prepare 5 reply templates for common questions: "how is this different from X?", "does it work with Y tool?", "what about Z attack vector?"
- Draft a follow-up HN comment with a technical detail to drop if the post hits front page
- Check calendar for March 24 morning. Block 9:30-10:30 AM for engagement. If meetings conflict, reschedule them.

**LinkedIn link strategy (2026 algorithm):**
- ZERO links in post body (estimated 25-50% reach reduction, some studies claim 60%)
- Drop link in first comment within 5 minutes
- Add repo to LinkedIn "Featured" section
- Alternative: "search mcp-scan on npm"
- Hashtags: 3-5 max. 6+ may trigger LinkedIn spam filters.

**Cross-platform rules:**
- LinkedIn carousel and Twitter thread are SEPARATE content, not copy-pastes
- Post Twitter 5 min after LinkedIn (not simultaneously)
- HN post goes first (needs the most organic momentum)

**Days 2-5 Engagement (critical, do NOT go silent after launch day):**

| Day | Action |
|-----|--------|
| Day 1 (Tue) | Launch. Reply to every comment within 30 min. Share to LinkedIn Story in the afternoon. |
| Day 2 (Wed) | Morning: reply to overnight comments. Afternoon: engage on 5-10 other people's posts in the security/AI space (genuine comments, not drive-bys). This signals to LinkedIn you're active. |
| Day 3 (Thu) | Post a "24 hours later" follow-up: "24 hours since I posted mcp-scan. X people tried it. The most common finding was Y." Short, data-driven, conversational. |
| Day 4 (Fri) | Engage only. No new posts. Reply to stragglers. DM anyone who commented something technical with a genuine thank-you (no pitch). |
| Day 5 (Sat/Sun) | If any social proof arrived (stars, forks, mentions), share one screenshot as a casual weekend post. "Didn't expect this. Thank you." Keep it brief. |

**Week 2:**
- Monday: "How mcp-scan's AST scanner detects reverse shells" (technical carousel, same design language)
- Wednesday: Share a real anonymized finding (screenshot + commentary)
- Friday: "5 MCP security mistakes I see in every config" (listicle carousel)

**Week 3 — Reddit + newsletters (WARM-UP REQUIRED):**

Reddit has aggressive self-promotion detection. You CANNOT just post cold.

Warm-up (start NOW, 1-2 weeks before posting):
- Leave 10+ genuine comments on posts in target subreddits before ever posting your own link
- Use the "10 replies before 1 post" rule

Subreddit strategy (ranked by friendliness to projects):
- r/node — most friendly to npm tools. Post as "I built X" format.
- r/cybersecurity — accepts tools if you lead with the security problem, not the tool
- r/machinelearning — accepts if framed as "security implications of MCP adoption"
- r/netsec — requires prior participation. Comment on other posts first. Very hostile to cold drops.
- r/programming — does NOT allow direct project posts. Submit a blog post or technical write-up that mentions the tool.

Newsletters to submit to:
- JavaScript Weekly, TLDR, Node Weekly, This Week in Security
- Submit 1-2 weeks before you want coverage (editorial lead time)

Discord servers:
- MCP community, Cursor, Continue.dev

**Week 4:**
- Publish first security advisory (MCP-SCAN-2026-001) for a real finding
- Reference it in a LinkedIn carousel for credibility

---

### 6. Audience Capture Strategy

Write to `linkedin-campaign/AUDIENCE-CAPTURE.md`.

**The biggest strategic gap: all traffic goes to GitHub. Social reach is rented. An email list is owned. Build direct audience capture from day one.**

**Email list (launch with free tier):**
- Platform: Buttondown (free up to 100 subs), Loops (free up to 1,000), or ConvertKit (free up to 300)
- Create a simple landing page or use GitHub README with a "Subscribe for security advisories" CTA
- Content: monthly MCP security digest, new scanner announcements, real findings (anonymized)
- Do NOT gate the tool behind email. Open source stays open. Email is for the security advisory audience.

**GitHub Discussions:**
- Enable GitHub Discussions on the repo
- Create a "Security Advisories" category
- Post findings there first, then cross-post to socials. This makes the repo the canonical source.

**Monetization seeds (plant now, harvest later):**
- GitHub Sponsors: set up 3 tiers ($5/month "Supporter", $25/month "Pro" with early access to new scanners, $100/month "Enterprise" with priority scanner requests)
- Security consulting CTA: "Need a custom MCP security audit? Contact rodolf@thynkq.com" (use personal email, NOT thynkq branding publicly)
- Do NOT push monetization during launch week. Let the community form first. Week 3-4 is the earliest to mention Sponsors.

---

### 7. GitHub Social Preview Spec

Write to `linkedin-campaign/GITHUB-PREVIEW-SPEC.md`.

1280x640px Open Graph image:
- Background: #000000
- Center: "mcp-scan" in Inter 600, 72px, #F5F5F7
- Below (12px gap): "Security scanner for MCP server configs" in Inter 400, 28px, #86868B
- Below (24px gap): `npx mcp-scan` in JetBrains Mono, 24px, #339DFF
- Subtle 5% opacity dot grid for depth (only decorative element)
- "Rodolf Boctor" in Inter 400, 16px, #86868B, bottom-right with 48px margin

---

### 8. Terminal Screenshot Specs

Write to `linkedin-campaign/TERMINAL-SCREENSHOTS.md`.

Two screenshots needed:

**Screenshot 1 — Full scan output (for carousel slides 6-7 and Twitter tweet 4):**
- Run `npx mcp-scan` on a setup with a known exposed key
- Capture full output: header box, finding cards, summary
- Terminal: dark theme (black bg), JetBrains Mono 16px, zero window chrome
- Crop to content, add 32px black padding all sides

**Screenshot 2 — Single finding close-up (for Twitter tweet 3):**
- Same scan, cropped to show one CRITICAL finding card
- Show severity badge, description, remediation hint

**How to create clean terminal screenshots on macOS:**
- Use iTerm2 with a clean "Presentation" profile (no tabs, no title bar)
- Or use `screencapture -R x,y,w,h screenshot.png` for pixel-perfect crops
- Remove any personal paths from the output before screenshotting

---

## Rules — follow every one exactly

- ZERO company branding anywhere. "Rodolf Boctor" only. This is employment-safe.
- No em dashes anywhere in any file. Periods, commas, semicolons only.
- No "excited to share", "leveraging", "comprehensive", "cutting-edge", "innovative", "game-changing", "thrilled"
- No emojis in design files. Zero in LinkedIn post. Max 1 per tweet if natural.
- Write like a senior engineer talking to peers. Not a marketer.
- Apple-level visual quality. Massive whitespace. One accent color only.
- All files go in `linkedin-campaign/` folder.
- Write in a distinctly HUMAN voice. LinkedIn detects AI-generated content and reduces reach by ~30%. Include specific personal details, use sentence fragments, casual rhythm. NO polished five-paragraph essays.
- After creating all text files, build the carousel as an actual visual component using Magic Patterns (create_design tool) so Rodolf can see the real rendered output and export slides.

Create all files and the Magic Patterns carousel design now. Do not ask questions. Start immediately.
```
