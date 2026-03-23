import os from 'os';
import path from 'path';

export function getConfigPaths() {
  const home = os.homedir();
  const platform = os.platform();
  const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  const userProfile = process.env.USERPROFILE || home;

  const paths = {
    'Claude Desktop': '',
    'Cursor': '',
    'VS Code': '',
    'Claude Code': '',
    'Windsurf': '',
    'Gemini CLI': '',
    'Codex CLI': '',
  };

  if (platform === 'darwin') {
    paths['Claude Desktop'] = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(home, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(home, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(home, '.claude.json');
    paths['Windsurf'] = path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(home, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(home, '.codex', 'config.toml');
  } else if (platform === 'win32') {
    paths['Claude Desktop'] = path.join(appData, 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(userProfile, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(userProfile, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(userProfile, '.claude.json');
    paths['Windsurf'] = path.join(userProfile, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(userProfile, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(userProfile, '.codex', 'config.toml');
  } else {
    // Linux and others
    paths['Claude Desktop'] = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
    paths['Cursor'] = path.join(home, '.cursor', 'mcp.json');
    paths['VS Code'] = path.join(home, '.vscode', 'mcp.json');
    paths['Claude Code'] = path.join(home, '.claude.json');
    paths['Windsurf'] = path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
    paths['Gemini CLI'] = path.join(home, '.gemini', 'settings.json');
    paths['Codex CLI'] = path.join(home, '.codex', 'config.toml');
  }

  return paths;
}

export function getProjectLevelPaths() {
  const cwd = process.cwd();
  return [
    path.join(cwd, '.mcp.json'),
    path.join(cwd, '.cursor', 'mcp.json'),
    path.join(cwd, '.vscode', 'mcp.json'),
    path.join(cwd, '.gemini', 'settings.json'),
    path.join(cwd, '.codex', 'config.toml')
  ];
}
