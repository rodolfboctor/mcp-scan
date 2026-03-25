import { describe, it, expect } from 'vitest';
import { parseConfig, extractServers } from '../../src/config/parser.js';
import path from 'path';

describe('Config Parser', () => {
  const validPath = path.join(__dirname, '../fixtures/valid-config.json');
  const jsoncPath = path.join(__dirname, '../fixtures/jsonc-config.json');
  const emptyPath = path.join(__dirname, '../fixtures/empty-config.json');
  const invalidPath = path.join(__dirname, '../fixtures/invalid-config.json');
  const noServersPath = path.join(__dirname, '../fixtures/no-mcpservers-config.json');

  it('should successfully parse a valid config', () => {
    const config = parseConfig(validPath);
    expect(config).not.toBeNull();
    expect(config?.mcpServers).toHaveProperty('sqlite');
    expect(config?.mcpServers).toHaveProperty('puppeteer');
  });

  it('should successfully parse JSONC (comments and trailing commas)', () => {
    const config = parseConfig(jsoncPath);
    expect(config).not.toBeNull();
    expect(config?.mcpServers).toHaveProperty('test');
    expect(config?.mcpServers.test.command).toBe('node');
  });

  it('should gracefully handle empty files', () => {
    const config = parseConfig(emptyPath);
    expect(config).toBeNull();
  });

  it('should gracefully handle invalid JSON without crashing', () => {
    const config = parseConfig(invalidPath);
    expect(config).toBeNull();
  });

  it('should extract empty servers array if mcpServers key is missing', () => {
    const config = parseConfig(noServersPath);
    const servers = extractServers('TestTool', noServersPath, config);
    expect(servers).toHaveLength(0);
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
