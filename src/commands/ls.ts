import Table from 'cli-table3';
import { detectTools } from '../config/detector.js';
import { parseConfig, extractServers } from '../config/parser.js';
import { logger } from '../utils/logger.js';

export function runLs() {
  const tools = detectTools();
  
  const table = new Table({
    head: ['Tool', 'Server Name', 'Command', 'Status', 'Args', 'Env Vars'],
    style: { head: ['cyan'] }
  });

  let totalCount = 0;

  for (const tool of tools) {
    if (!tool.exists) continue;
    const config = parseConfig(tool.configPath);
    if (!config) continue;

    const servers = extractServers(tool.name, tool.configPath, config);
    for (const server of servers) {
      table.push([
        tool.name,
        server.name,
        server.command,
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
