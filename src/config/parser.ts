import fs from 'fs';
import path from 'path';
import * as toml from 'smol-toml';
import { McpConfig, ResolvedServer, McpScanPolicy } from '../types/config.js';
import { logger } from '../utils/logger.js';

function parseJsonC(content: string) {
  // Remove BOM
  let json = content.replace(/^\uFEFF/, '');
  // Remove block comments /* */
  json = json.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments // (be careful not to remove in strings like http:// - basic heuristic)
  // A perfect JSONC parser is complex, but this handles standard config comments
  json = json.split('\n').map(line => {
    const commentIdx = line.indexOf('//');
    if (commentIdx === -1) return line;
    // Check if it's inside a string (very basic check)
    const before = line.substring(0, commentIdx);
    const quotes = (before.match(/"/g) || []).length;
    if (quotes % 2 !== 0) return line; // Inside a string
    return before;
  }).join('\n');
  // Remove trailing commas
  json = json.replace(/,\s*([\]}])/g, '$1');
  return JSON.parse(json);
}

export function parseConfig(configPath: string): McpConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    if (!content.trim()) return null;
    
    if (path.extname(configPath) === '.toml') {
       const parsed = toml.parse(content) as any;
       // Handle case where TOML structure might be mcpServers or mcp_servers
       const mcpServers = parsed.mcpServers || parsed.mcp_servers || {};
       return { mcpServers } as McpConfig;
    }

    return parseJsonC(content) as McpConfig;
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      logger.warn(`Failed to parse config at ${configPath}: ${error.message}`);
    }
    return null;
  }
}

export function extractServers(toolName: string, configPath: string, config: McpConfig | null): ResolvedServer[] {
  if (!config || !config.mcpServers) return [];

  const servers: ResolvedServer[] = [];
  for (const [name, entry] of Object.entries(config.mcpServers)) {
    servers.push({
      ...entry,
      name,
      toolName,
      configPath
    });
  }

  return servers;
}

export function loadPolicy(cwd: string = process.cwd()): McpScanPolicy | null {
  const policyPath = path.join(cwd, '.mcp-scan.json');
  try {
    if (fs.existsSync(policyPath)) {
      const content = fs.readFileSync(policyPath, 'utf8');
      return parseJsonC(content) as McpScanPolicy;
    }
  } catch (error: any) {
    logger.warn(`Failed to parse policy at ${policyPath}: ${error.message}`);
  }
  return null;
}

export function loadIgnoreList(cwd: string = process.cwd()): string[] {
  const ignorePath = path.join(cwd, '.mcp-scan-ignore');
  try {
    if (fs.existsSync(ignorePath)) {
      const content = fs.readFileSync(ignorePath, 'utf8');
      return content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    }
  } catch (_error) {}
  return [];
}

