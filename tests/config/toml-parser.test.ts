import { describe, it, expect } from 'vitest';
import { parseConfig, extractServers } from '../../src/config/parser.js';
import path from 'path';

describe('Codex TOML Parser', () => {
  const codexPath = path.join(__dirname, '../fixtures/codex-config.toml');

  it('should successfully parse a Codex TOML config', () => {
    const config = parseConfig(codexPath);
    expect(config).not.toBeNull();
    expect(config?.mcpServers).toHaveProperty('sqlite');
    expect(config?.mcpServers).toHaveProperty('puppeteer');
  });

  it('should extract servers correctly from TOML config', () => {
    const config = parseConfig(codexPath);
    const servers = extractServers('Codex CLI', codexPath, config);
    expect(servers).toHaveLength(2);
    expect(servers[0].name).toBe('sqlite');
    expect(servers[0].toolName).toBe('Codex CLI');
  });
});
