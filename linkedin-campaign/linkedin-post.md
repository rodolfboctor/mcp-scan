# LinkedIn Post Copy — mcp-scan Launch

## MAIN POST (scheduled Tue Mar 24, 9:30 AM ET)
### Character count target: 1,200–1,500 chars. Hook must be under 210 chars.

---

I ran a security scan on my own AI coding setup last week. Found an exposed GitHub token sitting in plaintext inside a Claude Desktop config I set up back in October and completely forgot about.

Five months. That token had been sitting in ~/.claude/claude_desktop_config.json for five months. Full repo access. Anyone with disk access could have grabbed it.

MCP (Model Context Protocol) is how Claude, Cursor, VS Code, and Windsurf connect to external tools. Every one of those tools writes a local config file. Those files contain API keys, package references, filesystem permissions, and HTTP endpoints. Nobody audits them. Nobody even thinks to look.

I looked. Then I built a scanner so you can too.

mcp-scan checks for:
- Exposed secrets in env vars (43+ patterns: GitHub tokens, OpenAI keys, Stripe keys, AWS creds)
- Typosquatted package names using homoglyph detection
- Known malicious MCP packages
- Overly broad filesystem permissions
- Reverse shells and injection patterns via AST analysis
- Prompt injection hidden in tool descriptions
- Unencrypted HTTP transport on remote servers

npx mcp-scan

One command. Zero config. MIT license. Works with Claude Desktop, Cursor, VS Code, Windsurf, Zed, and 9 more AI tools. Search mcp-scan on npm.

What's in your MCP configs right now?
A) Haven't checked
B) Checked and found something
C) Don't use MCP yet

#MCPSecurity #AITools #OpenSource

---

## FIRST COMMENT (post within 5 minutes of main post)

Repo: github.com/rodolfboctor/mcp-scan. MIT license, one command: npx mcp-scan. Works with 14 AI tools including Claude Desktop, Cursor, VS Code, Windsurf, Zed, Copilot, and more. 10 scanners, 43+ secret patterns. If you find something interesting, drop it in the comments.

---

## CHARACTER COUNT CHECK
Main post body (without hashtags): ~1,220 chars
With hashtags: ~1,260 chars
Hook (first 2 lines): ~178 chars (under 210)

---

## COPY NOTES
- Zero links in body. LinkedIn algo deprioritizes external links.
- "Search mcp-scan on npm" drives discovery without a link penalty.
- Forced-choice CTA drives 3x more comments than open questions.
- Written in first-person, past tense, specific detail (October, GitHub token). Sounds human.
- No em dashes. No "excited to share." No emojis.
- "npx mcp-scan" stands alone on its own line for visual weight.
- ALL claims are verifiable against the actual codebase.
