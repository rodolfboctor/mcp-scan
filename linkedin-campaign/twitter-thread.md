# Twitter/X Thread + Standalone Tweet — mcp-scan Launch

## POST TIME: 9:35 AM ET, Tuesday March 24
## PIN IMMEDIATELY after posting. Keep pinned 7-14 days.

---

## THREAD (7 tweets)

**Tweet 1 — Hook (no image)**
Found an exposed API token in my own AI setup last month. It was sitting in a Claude Desktop config in plaintext. Had been there since October.

Here's what I built.

---

**Tweet 2 — What it is**
mcp-scan: a security scanner for MCP server configs.

MCP is how Claude, Cursor, VS Code, and Windsurf connect to external tools. Every install writes a local config. Nobody audits them.

One command. Zero config. MIT license.

npx mcp-scan

---

**Tweet 3 — What it catches [IMAGE: scanner list or text card]**
10 scanners:

- Exposed API keys (43+ formats: OpenAI, GitHub, Stripe, AWS...)
- Typosquatting via Levenshtein + homoglyph detection
- Known malicious MCP packages
- Overly broad filesystem permissions (/ instead of ~/projects)
- Reverse shells and exfiltration via AST analysis
- Prompt injection in tool descriptions

[ATTACH: screenshot of scanner list from terminal output]

---

**Tweet 4 — Product shot [IMAGE: terminal output with a finding]**
Here's what it looks like when it finds something.

[ATTACH: clean terminal screenshot showing mcp-scan finding. Dark terminal, zero window chrome.]

---

**Tweet 5 — Why now**
MCP is everywhere. Claude, Cursor, VS Code, Zed, Windsurf, Copilot. All use it.

Each config file has:
- Plaintext secrets
- Unverified npm packages
- Filesystem paths nobody scoped
- HTTP endpoints nobody checked

Completely unaudited. Brand new attack surface.

---

**Tweet 6 — What's next #buildinpublic**
v2.0 is in progress:
- CVE lookup for known-bad package versions
- GitHub Action for CI/CD scanning
- Remote server auth analysis
- ugig.net marketplace integration

Building in public. #buildinpublic

---

**Tweet 7 — CTA**
Try it: npx mcp-scan

Star the repo if it's useful: github.com/rodolfboctor/mcp-scan

What did you find?

---

## STANDALONE TWEET (post 2-3 hours after thread, ~12:00 PM ET)

Built a security scanner for MCP configs. Ran it on my own setup. Found an exposed API token I forgot about, sitting in plaintext since October.

npx mcp-scan

[ATTACH: best terminal screenshot, single finding, clean dark background]

---

## THREAD RULES APPLIED
- 280 chars max per tweet (all verified)
- Zero hashtags except #buildinpublic on tweet 6
- No emojis (natural voice throughout)
- [IMAGE] markers where screenshots should be attached
- GitHub link on Twitter is fine, no reach penalty on X
- Pin thread immediately after posting
- Standalone backup tweet at noon catches thread-skippers
- ALL claims verifiable. No fabricated stats or numbers.
- No em dashes. Commas, periods, or new sentences only.
