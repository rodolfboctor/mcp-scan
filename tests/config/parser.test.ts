import { describe, it, expect } from 'vitest';
import { parseConfig, extractServers } from '../../src/config/parser.js';
import path from 'path';

describe('Config Parser', () => {
  const validPath = path.join(__dirname, '../fixtures/valid-config.json');

  it('should successfully parse a valid config', () => {
    const config = parseConfig(validPath);
    expect(config).not.toBeNull();
    expect(config?.mcpServers).toHaveProperty('sqlite');
    expect(config?.mcpServers).toHaveProperty('puppeteer');
  });

  it('should return null for non-existent file gracefully', () => {
    const config = parseConfig('non-existent.json');
    expect(config).toBeNull();
  });

  it('should extract servers correctly', () => {
    const config = parseConfig(validPath);
    const servers = extractServers('TestTool', validPath, config);
    expect(servers).toHaveLength(2);
    expect(servers[0].name).toBe('sqlite');
    expect(servers[0].toolName).toBe('TestTool');
  });
});
