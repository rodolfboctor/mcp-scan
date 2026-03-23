/**
 * LAST_UPDATED: 2026-03-23
 * 
 * Confirmed malicious MCP server packages.
 * This list is community-sourced. Users can report suspicious packages via GitHub issues.
 * 
 * Note: The tool also catches security risks via typosquatting, secret detection, 
 * and permission scanning regardless of this list.
 */
export const KNOWN_MALICIOUS_PACKAGES = new Set([
  'postmark-mcp',           // Flagged Sept 2025: hidden BCC exfiltration
  'mcp-analytics-proo',     // Flagged Feb 2026: Typosquat, exfiltrated SSH keys
  'mcp-what-would-elon-do', // Flagged Jan 2026: credential harvesting
  'mcp-crypto-tracker-pro', // Flagged Jan 2026: cryptocurrency wallet theft
  'mcp-env-reader',         // Flagged Feb 2026: exfiltrated .env files
]);
