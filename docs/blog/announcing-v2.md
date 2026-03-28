# Announcing mcp-scan v2.0: Data Controls for MCP Servers

MCP servers run with full access to your filesystem, your API keys, and your network. Until now, there was no way to know where your data goes after an MCP server processes it. mcp-scan v2.0 changes that.

This major upgrade transforms mcp-scan from a simple configuration scanner into a comprehensive security platform for the Model Context Protocol ecosystem.

## Key Features in v2.0

*   **Data Flow Analysis**: See exactly where your data goes. mcp-scan now performs static analysis to trace data from sensitive sources (like your files) to external sinks (like a third-party API).
*   **Network Egress Monitoring**: Know every endpoint your servers contact. We detect all outbound connections and categorize them, flagging suspicious or unknown destinations.
*   **Privacy Impact Assessment**: One command (`mcp-scan privacy`) generates a compliance-ready report on PII handling, data retention, and encryption.
*   **Policy Engine**: Enforce custom security rules across your team with a simple `.mcp-scan-policy.yml` file.
*   **SBOM Generation**: Meet executive order and procurement requirements with CycloneDX and SPDX software bill of materials generation.
*   **GitHub Action & SARIF**: Integrate security scanning directly into your CI/CD pipeline. Get findings in your GitHub Security tab.
*   **Compliance Mapping**: Automatically map findings to controls for SOC 2, GDPR, HIPAA, PCI-DSS, and NIST 800-53.

## What's Next

Our vision is to provide a complete security solution for the AI-powered development workflow. Our roadmap includes:

*   **Runtime Monitoring**: Real-time analysis of MCP traffic.
*   **Sandboxed Execution**: Run MCP servers in isolated environments.
*   **Real-Time Alerting**: Get notified of critical security events as they happen.

## Get Started

Upgrade to the latest version to take advantage of these new features:

```bash
npx mcp-scan@latest
```

We believe these new capabilities will help developers and security teams alike to adopt MCP with confidence. We look forward to your feedback.

Star us on [GitHub](https://github.com/rodolfboctor/mcp-scan) and report any findings!
