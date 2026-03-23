import { describe, it, expect } from 'vitest';
import path from 'path';
import { getConfigPaths } from '../../src/config/paths.js';
import { detectTools } from '../../src/config/detector.js';

describe('Detector Paths', () => {
  it('should return a list of paths for different tools', () => {
    const paths = getConfigPaths();
    expect(paths).toHaveProperty('Claude Desktop');
    expect(paths).toHaveProperty('Cursor');
    expect(paths).toHaveProperty('VS Code');
    expect(paths).toHaveProperty('Claude Code');
    expect(paths).toHaveProperty('Windsurf');
  });

  it('should format paths correctly based on string type', () => {
    const paths = getConfigPaths();
    expect(typeof paths['Cursor']).toBe('string');
  });

  it('should not detect same config path under multiple tool names', () => {
    const tools = detectTools();
    const pathCounts = new Map<string, number>();
    for (const tool of tools) {
      const resolved = path.resolve(tool.configPath);
      pathCounts.set(resolved, (pathCounts.get(resolved) || 0) + 1);
    }
    for (const [filePath, count] of pathCounts) {
      expect(count, `${filePath} detected ${count} times`).toBe(1);
    }
  });
});
