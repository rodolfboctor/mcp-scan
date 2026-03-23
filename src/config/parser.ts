import fs from 'fs';
import { McpConfig, ResolvedServer } from '../types/config.js';
import { logger } from '../utils/logger.js';

export function parseConfig(configPath: string): McpConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    if (!content.trim()) return null;
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
