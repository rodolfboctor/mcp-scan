**Twitter/X Thread:**

1/ We're excited to launch mcp-scan v2.0! We've transformed it from a simple scanner into a full-fledged security platform for the MCP ecosystem. Know where your data goes.

2/ The headline feature is our new Data Flow Analyzer. It statically analyzes your MCP servers to trace data from sensitive sources (like your files) to external sinks (like third-party APIs).

3/ We've also added a Network Egress Monitor to detect and report all external network endpoints an MCP server communicates with. No more surprise phone-homes.

4/ Compliance just got easier. `mcp-scan privacy` generates a privacy impact assessment, and `mcp-scan compliance` maps findings to SOC 2, GDPR, HIPAA, and more.

5/ For our enterprise users, we've added a Policy Engine to enforce custom security rules and SBOM generation for both CycloneDX and SPDX formats.

6/ And of course, we've upgraded our GitHub Action to support SARIF uploads, so you can get findings directly in your GitHub Security tab.

7/ Upgrade today with `npx mcp-scan@latest` and let us know what you think!

**LinkedIn Post:**

I'm thrilled to announce the release of mcp-scan v2.0, a major leap forward in security for the Model Context Protocol ecosystem.

When I started mcp-scan, the goal was simple: provide basic security scanning for MCP configurations. But as the ecosystem has grown, so have the risks. It's no longer enough to just check for hardcoded secrets. We need to understand where our data is going.

That's why we've rebuilt mcp-scan from the ground up as a comprehensive security platform. Our new Data Flow Analyzer provides unprecedented visibility into how your MCP servers handle your data. Our Network Egress Monitor tells you exactly who your servers are talking to. And our new compliance and policy engines help you enforce your security requirements at scale.

This is a huge step forward for MCP security, and I'm incredibly proud of what our team has built. I'm excited to see how the community uses these new tools to build amazing things with MCP, securely.

Check out the full announcement here: [link to blog post]

\#MCP #AI #Security #OpenSource #DevSecOps

**Reddit Post (r/cybersecurity):**

**Title:** I built an open-source security platform for the Model Context Protocol (MCP) - looking for feedback

Hey r/cybersecurity,

I'm the creator of mcp-scan, an open-source security scanner for the Model Context Protocol (MCP), a new protocol for AI development tools.

I just released v2.0, which transforms the tool from a simple config scanner into a more comprehensive security platform. I'd love to get your feedback.

Some of the new features:

*   **Data Flow Analysis**: Statically analyzes MCP servers to trace data from sensitive sources to external sinks.
*   **Network Egress Monitoring**: Detects all outbound network connections from MCP servers.
*   **Compliance Mapping**: Maps findings to SOC 2, GDPR, HIPAA, etc.
*   **Policy Engine**: Lets you define custom security rules in YAML.
*   **SBOM Generation**: Creates CycloneDX and SPDX SBOMs.

The goal is to bring some much-needed security and visibility to the rapidly growing AI development ecosystem. You can check it out on GitHub: [link]

I'm particularly interested in feedback on the data flow analysis and compliance mapping features. What other security challenges are you seeing in the AI/ML development world?

Thanks!
