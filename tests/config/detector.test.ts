import { describe, it, expect } from 'vitest';
import { getConfigPaths } from '../../src/config/paths.js';

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
});
