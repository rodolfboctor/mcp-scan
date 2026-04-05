
import path from 'path';
import fg from 'fast-glob';

export function getConfigPaths(dependencies: { homedir: () => string, platform: () => string, env: NodeJS.ProcessEnv }) {
  const home = dependencies.homedir();
  const platform = dependencies.platform();
  const appData = dependencies.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  const userProfile = dependencies.env.USERPROFILE || home;

  const paths: Record<string, string> = {
    'Claude Desktop': '',
    'Cursor': '',
    'VS Code': '',
    'Claude Code': '',
    'Windsurf': '',
    'Gemini CLI': '',
    'Codex CLI': '',
    'Zed': '', // New
    'Continue.dev': '', // New
    'Amp': '', // New
    'Plandex': '', // New
    'ChatGPT Desktop': '', // New
    'GitHub Copilot': '', // New
    'Kiro': '', // New
    'Warp': '', // New
  };

  if (platform === 'darwin') {
    paths['Claude Desktop'] = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(home, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(home, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(home, '.claude.json');
    paths['Windsurf'] = path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(home, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(home, '.codex', 'config.toml');
    paths['Zed'] = path.join(home, '.config', 'zed', 'settings.json');
    paths['Continue.dev'] = path.join(home, '.continue', 'config.json');
    paths['Amp'] = path.join(home, '.amp', 'config.json');
    paths['Plandex'] = path.join(home, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(home, 'Library', 'Application Support', 'com.openai.chat', 'settings.json');
    paths['GitHub Copilot'] = path.join(home, '.config', 'github-copilot', 'apps.json');
    paths['Kiro'] = path.join(home, 'Library', 'Application Support', 'Kiro', 'User', 'mcp.json');
    paths['Warp'] = path.join(home, '.warp', 'mcp.json');
  } else if (platform === 'win32') {
    paths['Claude Desktop'] = path.join(appData, 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(userProfile, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(userProfile, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(userProfile, '.claude.json');
    paths['Windsurf'] = path.join(userProfile, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(userProfile, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(userProfile, '.codex', 'config.toml');
    paths['Zed'] = path.join(userProfile, '.config', 'zed', 'settings.json');
    paths['Continue.dev'] = path.join(userProfile, '.continue', 'config.json');
    paths['Amp'] = path.join(userProfile, '.amp', 'config.json');
    paths['Plandex'] = path.join(userProfile, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(appData, 'com.openai.chat', 'settings.json');
    paths['GitHub Copilot'] = path.join(userProfile, '.config', 'github-copilot', 'apps.json');
    paths['Kiro'] = path.join(appData, 'Kiro', 'User', 'mcp.json');
    paths['Warp'] = path.join(userProfile, '.warp', 'mcp.json');
  } else {
    // Linux and others
    paths['Claude Desktop'] = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(home, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(home, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(home, '.claude.json');
    paths['Windsurf'] = path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(home, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(home, '.codex', 'config.toml');
    paths['Zed'] = path.join(home, '.config', 'zed', 'settings.json');
    paths['Continue.dev'] = path.join(home, '.continue', 'config.json');
    paths['Amp'] = path.join(home, '.amp', 'config.json');
    paths['Plandex'] = path.join(home, '.plandex', 'config.json');
    paths['ChatGPT Desktop'] = path.join(home, '.config', 'com.openai.chat', 'settings.json');
    paths['GitHub Copilot'] = path.join(home, '.config', 'github-copilot', 'apps.json');
    paths['Kiro'] = path.join(home, '.config', 'Kiro', 'User', 'mcp.json');
    paths['Warp'] = path.join(home, '.warp', 'mcp.json');
  }

  return paths;
}

export async function getExtensionGlobPaths(toolName: 'Cline' | 'Roo Code', dependencies: { homedir: () => string }): Promise<string[]> {
  const home = dependencies.homedir();
  const baseVsCodeExtensionsPath = path.join(home, '.vscode', 'extensions');
  let globPattern: string;

  if (toolName === 'Cline') {
    globPattern = 'saoudrizwan.claude-dev*/settings.json';
  } else if (toolName === 'Roo Code') {
    globPattern = 'rooveterinaryinc.roo-cline*/settings.json';
  } else {
    return [];
  }

  const matchedPaths = await fg(path.join(baseVsCodeExtensionsPath, globPattern), {
    cwd: baseVsCodeExtensionsPath,
    absolute: true,
    onlyFiles: true,
    dot: true,
    deep: 1
  });

  return matchedPaths;
}

export function getProjectLevelPaths(dependencies: { cwd: () => string }) {
  const cwd = dependencies.cwd();
  return [
    path.join(cwd, '.mcp.json'),
    path.join(cwd, 'mcp.json'),
    path.join(cwd, '.cursor', 'mcp.json'),
    path.join(cwd, '.vscode', 'mcp.json'),
    path.join(cwd, '.gemini', 'settings.json'),
    path.join(cwd, '.codex', 'config.toml'),
    path.join(cwd, '.amp', 'config.json'),
    path.join(cwd, '.continue', 'config.json'),
  ];
}
