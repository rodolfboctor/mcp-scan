export interface McpServerEntry {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  disabled?: boolean;
}

export interface McpConfig {
  mcpServers: Record<string, McpServerEntry>;
}

export interface DetectedTool {
  name: string;
  configPath: string;
  exists: boolean;
}

export interface ResolvedServer extends McpServerEntry {
  name: string;
  toolName: string;
  configPath: string;
}
