import fs from 'fs';
import path from 'path';
import { getConfigPaths, getProjectLevelPaths } from './paths.js';
import { DetectedTool } from '../types/config.js';

/**
 * Detects all installed AI tools and their MCP configuration paths.
 * Deduplicates by resolved path to avoid false "Project Local" duplicates
 * when running from the home directory.
 * 
 * @returns {DetectedTool[]} List of detected tools and their config status
 */
export function detectTools(): DetectedTool[] {
  const paths = getConfigPaths();
  const detected: DetectedTool[] = [];
  const seenPaths = new Set<string>();

  for (const [name, configPath] of Object.entries(paths)) {
    const resolved = path.resolve(configPath);
    seenPaths.add(resolved);
    detected.push({
      name,
      configPath: resolved,
      exists: fs.existsSync(resolved)
    });
  }

  // Add project level configs if they exist (skip if already detected as global)
  const projectPaths = getProjectLevelPaths();
  for (const configPath of projectPaths) {
    const resolved = path.resolve(configPath);
    if (seenPaths.has(resolved)) continue;
    if (fs.existsSync(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name: 'Project Local',
        configPath: resolved,
        exists: true
      });
    }
  }

  return detected;
}
