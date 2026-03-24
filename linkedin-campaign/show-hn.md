# Show HN Post — mcp-scan

## TITLE (58 chars)
Show HN: mcp-scan – security scanner for MCP server configs

---

## BODY

Hey HN. I'm Rodolf, a security-focused engineer working on AI tooling. I built mcp-scan (github.com/rodolfboctor/mcp-scan) after running it on my own setup and finding an API token I forgot was there, sitting in plaintext in a Claude Desktop config from October.

Snyk acquired Invariant Labs (creators of the original mcp-scan proof-of-concept) last year. Their version required Python and focused on prompt injection. This is a different tool: pure Node.js CLI, zero install friction (npx mcp-scan), and focused on the unsexy stuff that actually gets people compromised: leaked secrets, typosquatting, malicious packages, insecure transport. If you want prompt injection detection, that's a different problem. This solves the basics that nobody is checking.

Under the hood: 10 scanners. The AST scanner parses server entry scripts using the TypeScript compiler API, looking for reverse shells (child_process.exec piped to curl), eval() on untrusted input, and data exfiltration patterns. Typosquatting detection runs Levenshtein distance comparisons against the official MCP package registries, with homoglyph substitution detection on top (modeicontextprotocol vs modelcontextprotocol). The secret scanner covers 43+ API key formats via regex: OpenAI, GitHub, Stripe, AWS, Anthropic, and more. Config parser supports 14 AI tools out of the box, auto-detecting whichever are installed: Claude Desktop, Cursor, VS Code, Windsurf, Zed, GitHub Copilot, ChatGPT Desktop, Gemini CLI, Codex CLI, Cline, Roo Code, and more.

MCP is becoming the standard for AI tool extensibility. Every major IDE and AI assistant supports it now. Each config file contains plaintext secrets, npm package references that have never been verified, filesystem permissions that often default to /, and HTTP endpoints for remote servers that nobody checked. It's a brand new, completely unaudited attack surface. One command: npx mcp-scan.

Looking for feedback on which scanners would be most useful to add next. What patterns are you seeing in MCP configs that concern you?

---

## PRE-WRITTEN FIRST COMMENT
(Post as your own comment within 5 minutes of submission.)

The hardest engineering challenge was AST analysis across package manager formats. MCP server entries can be Node scripts, Python modules, or Docker containers, each with different entry point conventions. The scanner has to resolve the actual entry file from the MCP config's "command" field, then handle the case where it's an npx invocation, a local path, or a global install. Getting reliable source code to parse required building a custom resolver that walks node_modules, handles symlinks from pnpm, and degrades gracefully when source maps are missing.

If anyone is running MCP servers with custom transports, especially anything using SSE over HTTP for remote connections, I'd love to hear what auth patterns you're using. I'm seeing configs with raw Bearer tokens in URL params, which is a whole separate category of problem.

---

## TIMING NOTE
Submit at 8:45 AM ET on Tuesday March 24. This gives 15 minutes of organic momentum before LinkedIn and Twitter posts go live.

## HN TONE RULES APPLIED
- "Hey HN" opener. One sentence on who you are, straight to the tool.
- Named the competitor (Invariant/Snyk) in paragraph 1 for category placement.
- Specific technical numbers: 43+ formats, Levenshtein distance, TypeScript compiler API.
- No roadmap in body. Roadmap goes in comment replies only.
- Feedback request at end invites technical discussion.
- "I built a small tool" energy throughout. Zero superlatives.
- ALL claims verifiable against the codebase.
- Removed fabricated "exfiltrating package" anecdote from first comment.
