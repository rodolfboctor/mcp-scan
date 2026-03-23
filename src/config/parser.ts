import fs from 'fs';
import path from 'path';
import * as toml from 'smol-toml';
import { McpConfig, ResolvedServer } from '../types/config.js';
import { logger } from '../utils/logger.js';

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

    return JSON.parse(content) as McpConfig;
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
