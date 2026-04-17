import Table from 'cli-table3';
import fs from 'fs';
import os from 'os';
import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { logger } from '../utils/logger.js';

export async function runLs() {
  const tools = await detectTools({ fs, os, process });
  
  const table = new Table({
    head: ['Tool', 'Server Name', 'Command / URL', 'Status', 'Args', 'Env Vars'],
    style: { head: ['cyan'] }
  });

  let totalCount = 0;

  for (const tool of tools) {
    if (!tool.exists) continue;
    const config = parseConfig(tool.configPath);
    if (!config) continue;

    const servers = extractServers(tool.name, tool.configPath, config);
    for (const server of servers) {
      const commandOrUrl = server.url || server.command || '';
      table.push([
        tool.name,
        server.name,
        commandOrUrl,
        server.disabled ? 'Disabled' : 'Active',
        server.args?.length || 0,
        Object.keys(server.env || {}).length
      ]);
      totalCount++;
    }
  }

  logger.log(table.toString());
  logger.brand(`Total servers detected: ${totalCount}`);
}
