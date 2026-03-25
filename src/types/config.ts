export interface McpServerEntry {
  command?: string;
  args?: string[];
  url?: string;
  type?: string;
  env?: Record<string, string>;
  disabled?: boolean;
  description?: string;
  schema?: any;
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

export interface McpScanPolicy {
  allowedPackages?: string[];
  blockedPackages?: string[];
  allowedDomains?: string[];
  requiredEnvVarPrefix?: string;
  maxSeverity?: 'info' | 'low' | 'medium' | 'high' | 'critical';
  suppressRules?: string[];
  privacy?: {
    maskPii?: boolean;
    excludePatterns?: string[];
    customPatterns?: Record<string, string>;
  };
}
