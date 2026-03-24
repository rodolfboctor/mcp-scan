# mcp-scan Launch Playbook — Tuesday March 24, 2026

---

## PRE-LAUNCH CHECKLIST (Complete tonight, Monday March 23)

- [ ] Cancel the currently scheduled text-only LinkedIn post (Tue Mar 24, 8:30 AM)
- [ ] Export carousel PDF at 2x resolution (2160x2700px per page, under 5MB total)
- [ ] Test PDF upload to LinkedIn in a draft post — verify no quality degradation
- [ ] Add GitHub repo to LinkedIn Featured section: github.com/rodolfboctor/mcp-scan
- [ ] Update LinkedIn headline to include "Creator of mcp-scan" (see headline note below)
- [ ] Set GitHub social preview image (see GITHUB-PREVIEW-SPEC.md)
- [ ] Enable GitHub Discussions on the repo
- [ ] Set up email capture landing page (even a basic GitHub Pages site — see AUDIENCE-CAPTURE.md)
- [ ] Have 5 reply templates ready for common questions (see below)
- [ ] If you have friends engaging on HN: confirm they have established accounts with history

---

## LAUNCH DAY SCHEDULE — Tuesday March 24, 2026

| Time (ET) | Action | Platform | Notes |
|-----------|--------|----------|-------|
| 8:45 AM | Submit Show HN post | Hacker News | Exact title: "Show HN: mcp-scan – security scanner for MCP server configs". Gives 15 min organic momentum before other platforms. |
| 8:50 AM | Post your own first comment on HN | Hacker News | Technical depth drop — pre-written. See show-hn.md |
| 9:30 AM | Post carousel as document post | LinkedIn | "Add a document" button (not image). PDF upload. Caption = linkedin-post.md copy. |
| 9:32 AM | Post first comment with repo link | LinkedIn | Within 5 min of main post. See linkedin-post.md |
| 9:35 AM | Post Twitter thread | Twitter/X | Pin thread immediately after posting |
| 9:30–10:00 AM | Reply to EVERY comment | All platforms | First 30 min is make-or-break for algorithmic boost |
| 12:00 PM | Post standalone tweet | Twitter/X | Single tweet with best terminal screenshot. See twitter-thread.md |
| 12:00 PM | Check HN rank | Hacker News | If on front page, drop additional technical comment |
| 12:30 PM | Afternoon LinkedIn reply sweep | LinkedIn | Replying to comments re-signals the algorithm |
| 6:00 PM | Evening engagement sweep | All | Reply to everything that came in during the day |

---

## LINKEDIN UPLOAD INSTRUCTIONS
1. Go to linkedin.com/feed
2. Click "Start a post"
3. Click the document icon (not the image icon) — labeled "Add a document"
4. Upload the carousel PDF
5. Add a title for the document (LinkedIn will prompt): "mcp-scan — Security Scanner for MCP Configs"
6. Paste the post copy from linkedin-post.md into the post body
7. Schedule for 9:30 AM ET, Tuesday March 24
8. Do NOT add any URLs to the post body

---

## HN FRIEND ENGAGEMENT RULES (Read carefully)
HN's shill ring detection is aggressive. If you have friends willing to help:
- They MUST have established HN accounts with comment history (not new accounts)
- Stagger their engagement: first friend at 15 min, second at 30 min, third at 60+ min
- Comments only — no coordinated upvoting
- Only genuine technical observations: "Does this catch X?" or "How does AST handle Y?"
- NO "great project!" or "awesome tool!" comments — these are shill signals
- Never ask anyone to upvote directly

---

## REPLY TEMPLATES (have these ready)

**"How is this different from Invariant Labs / Snyk's version?"**
"Snyk acquired Invariant's work — their focus is prompt injection and LLM-layer attacks. mcp-scan is focused on the config layer: secrets, packages, permissions, transport. Different problem. They're complementary."

**"Does it work with [tool X]?"**
"Right now: Claude Desktop, Cursor, VS Code, Windsurf, and Zed. Auto-detects whichever are installed. Happy to add more — open a GitHub issue with the config format."

**"What about remote MCP servers?"**
"We detect unencrypted HTTP transport and flag it. Auth token analysis for remote servers is on the v2 roadmap. The config layer issues (local secrets, permissions) are what we solve today."

**"Is this safe to run? Does it send data anywhere?"**
"Zero telemetry. No network calls except checking against the official MCP package registry. Everything runs locally. MIT license — read the code."

**"Can I use this in CI/CD?"**
"Yes — run `npx mcp-scan --ci` and it exits with code 1 on critical findings. Works in GitHub Actions, GitLab CI, etc."

---

## DAYS 2–5 ENGAGEMENT STRATEGY

**Day 2 (Wed Mar 25)**
- Reply to every new comment on all platforms
- Share the LinkedIn post to your LinkedIn Story
- Engage on 5–10 posts from AI/security creators in your niche (genuine comments, not promotional)

**Day 3 (Thu Mar 26)**
- Post a "24 hours later" follow-up text post on LinkedIn:
  "Launched mcp-scan yesterday. Here's what happened: [X impressions, Y GitHub stars, Z interesting findings people reported]. The most common thing people found: [insert real finding]. Still replying to comments."
- This narrative arc drives a second wave of engagement.

**Day 4 (Fri Mar 27)**
- No new post. Give the algorithm room to keep distributing the carousel.
- Reply to any remaining comments. Engage on others' posts.

**Day 5 (Sat Mar 28)**
- Share one specific anonymized finding from someone who ran the tool (with permission).
- Post as a simple text post: "Someone ran mcp-scan this week and found [X]. Here's what it looked like."
- This is social proof and drives more installs.

---

## WEEK 2 CONTENT PLAN

**Monday Mar 30:** "How mcp-scan's AST scanner detects reverse shells" — technical carousel, same Apple design language. Walk through the actual code patterns it catches.

**Wednesday Apr 1:** Share a real anonymized finding with screenshot + commentary. "Real finding from the wild: [description]."

**Friday Apr 3:** "5 MCP security mistakes I see in every config" — listicle carousel. Broad appeal, shareable.

---

## WEEK 3: REDDIT (requires warm-up — START NOW)

IMPORTANT: Do not cold-drop your project in Reddit. Start leaving genuine helpful comments in these subreddits this week, before launch. Build karma and history first.

Target subreddits ranked by friendliness for self-promotion:
1. **r/coolgithubprojects** — designed for this. Post here first on launch day.
2. **r/SideProject** — supportive. Share the story, not just the link.
3. **r/node** — frame as technical deep-dive on AST analysis approach.
4. **r/netsec** — requires prior participation. Only after you have comment history there.
5. **r/programming** — does NOT allow direct project posts. Share via blog post or writeup.
6. **r/machinelearning** — frame around MCP security attack surface, not the tool.

Rule: Give 10 high-effort comments before you post once. Only link when someone asks or in weekly showcase threads.

Submit to newsletters (Week 3):
- JavaScript Weekly — https://javascriptweekly.com/advertise (free submissions via their contact form)
- TLDR Newsletter — https://tldr.tech/submit
- Node Weekly — https://nodeweekly.com/advertise
- This Week in Security — https://this.weekinsecurity.com

---

## WEEK 4: CREDIBILITY MOVE

Publish your first security advisory: **MCP-SCAN-2026-001**
- Pick a real finding the tool caught
- Write it up in standard CVE advisory format (even without an official CVE number)
- Post it as a GitHub Security Advisory on the repo
- Reference it in a LinkedIn post: "mcp-scan just published its first MCP security advisory"
- This positions you as a security researcher, not just a tool author

---

## LINKEDIN HEADLINE NOTE
Current: "Head of AI Product / Chief Engineer @ Power Liens | Former Sanofi AI Lead | Wizz Air Al Lead (700K+ monthly automations) | Founder (Acquired) | 2x Employee of the Year"

Suggested addition at end: "| Creator of mcp-scan (open source)"

When thousands of people see your post, they click your profile. Right now there's nothing there that connects to mcp-scan. Adding it to the headline and Featured section converts profile views into repo visits.

---

## CROSS-PLATFORM LINK STRATEGY SUMMARY
| Platform | Link in post? | Notes |
|----------|--------------|-------|
| LinkedIn | NO | Body = zero links. First comment = repo link. |
| Twitter/X | YES | No penalty on X. Link in tweet 7 and standalone tweet. |
| Hacker News | YES (early) | GitHub link in paragraph 3 of body. |
| Reddit | Varies | Check each subreddit's rules. |
