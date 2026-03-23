import fs from 'fs';
import { getConfigPaths, getProjectLevelPaths } from './paths.js';
import { DetectedTool } from '../types/config.js';

export function detectTools(): DetectedTool[] {
  const paths = getConfigPaths();
  const detected: DetectedTool[] = [];

  for (const [name, configPath] of Object.entries(paths)) {
    detected.push({
      name,
      configPath,
      exists: fs.existsSync(configPath)
    });
  }

  // Add project level configs if they exist
  const projectPaths = getProjectLevelPaths();
  for (const configPath of projectPaths) {
    if (fs.existsSync(configPath)) {
      detected.push({
        name: `Project Local`,
        configPath,
        exists: true
      });
    }
  }

  return detected;
}
