import path from 'path';
import { getConfigPaths, getProjectLevelPaths, getExtensionGlobPaths } from './paths.js';
import { DetectedTool } from '../types/config.js';

interface DetectorDependencies {
  fs: typeof import('fs');
  os: typeof import('os');
  process: {
    cwd: () => string;
    env: NodeJS.ProcessEnv;
  };
}

export async function detectTools(dependencies: DetectorDependencies): Promise<DetectedTool[]> {
  const { fs, os, process } = dependencies;
  const paths = getConfigPaths({ homedir: os.homedir, platform: os.platform, env: process.env });
  const detected: DetectedTool[] = [];
  const seenPaths = new Set<string>();

  for (const [name, configPath] of Object.entries(paths)) {
    const resolved = path.resolve(configPath);
    if (resolved && !seenPaths.has(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name,
        configPath: resolved,
        exists: fs.existsSync(resolved)
      });
    }
  }

  // Add extension glob paths
  const clinePaths = await getExtensionGlobPaths('Cline', { homedir: os.homedir });
  for (const configPath of clinePaths) {
    const resolved = path.resolve(configPath);
    if (!seenPaths.has(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name: 'Cline',
        configPath: resolved,
        exists: fs.existsSync(resolved)
      });
    }
  }

  const rooCodePaths = await getExtensionGlobPaths('Roo Code', { homedir: os.homedir });
  for (const configPath of rooCodePaths) {
    const resolved = path.resolve(configPath);
    if (!seenPaths.has(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name: 'Roo Code',
        configPath: resolved,
        exists: fs.existsSync(resolved)
      });
    }
  }

  // Add project level configs if they exist (skip if already detected as global)
  const projectPaths = getProjectLevelPaths({ cwd: process.cwd });

  for (const configPath of projectPaths) {
    const resolved = path.resolve(configPath);

    if (seenPaths.has(resolved)) {

      continue;
    }

    if (fs.existsSync(resolved)) {
      seenPaths.add(resolved);
      detected.push({
        name: resolved.endsWith('.mcp.json') ? 'Project .mcp.json' : 'Project Local',
        configPath: resolved,
        exists: true
      });

    } else {

    }
  }



  return detected;
}
