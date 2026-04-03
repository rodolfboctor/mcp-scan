/**
 * Static definitions of sensitive data sources and external sinks
 * used by the Data Flow Analyzer scanner.
 *
 * Sources: where sensitive data originates (filesystem, env vars, clipboard, etc.)
 * Sinks: where data exits the trust boundary (network, processes, files)
 */

export interface DataFlowSource {
  name: string;
  description: string;
  /** Regex patterns matched against command + args + description */
  patterns: RegExp[];
  /** Known package names (or substrings) that indicate this source */
  packages: string[];
}

export interface DataFlowSink {
  name: string;
  description: string;
  patterns: RegExp[];
  packages: string[];
}

export const FILESYSTEM_SOURCES: DataFlowSource[] = [
  {
    name: 'filesystem-read',
    description: 'Reads files from the local filesystem',
    patterns: [
      /filesystem/i,
      /file[-_]?read/i,
      /read[-_]?file/i,
      /fs[-_]?read/i,
      /\bfs\b/i,
    ],
    packages: [
      '@modelcontextprotocol/server-filesystem',
      'mcp-server-filesystem',
      'mcp-filesystem',
      'mcp-server-files',
      'mcp-file-server',
    ],
  },
  {
    name: 'env-var-access',
    description: 'Accesses environment variables which may contain credentials',
    patterns: [
      /process\.env/i,
      /env[-_]?var/i,
    ],
    packages: [],
  },
  {
    name: 'clipboard-read',
    description: 'Reads from the system clipboard',
    patterns: [
      /clipboard/i,
      /pasteboard/i,
    ],
    packages: [
      'mcp-clipboard',
      'mcp-server-clipboard',
    ],
  },
  {
    name: 'database-read',
    description: 'Reads from a local database',
    patterns: [
      /sqlite/i,
      /postgres(?:ql)?/i,
      /mysql/i,
      /\bmongo\b/i,
      /\bdb\b.*read/i,
    ],
    packages: [
      'mcp-server-sqlite',
      '@modelcontextprotocol/server-postgres',
      'mcp-postgres',
    ],
  },
];

export const NETWORK_SINKS: DataFlowSink[] = [
  {
    name: 'http-egress',
    description: 'Makes outbound HTTP/HTTPS requests',
    patterns: [
      /https?:\/\//i,
      /\bfetch\b/i,
      /\baxios\b/i,
      /\bgot\b/i,
      /\bhttp(?:s)?\b/i,
    ],
    packages: [
      '@modelcontextprotocol/server-fetch',
      'mcp-server-fetch',
      'mcp-fetch',
      'mcp-server-http',
      'mcp-http',
      'mcp-browser-tools',
      'mcp-puppeteer',
      'mcp-playwright',
      '@modelcontextprotocol/server-brave-search',
      'mcp-server-brave-search',
      'mcp-server-google',
    ],
  },
  {
    name: 'process-execution',
    description: 'Executes external processes that may transmit data',
    patterns: [
      /\bexec\b/i,
      /\bspawn\b/i,
      /child_process/i,
      /\bcurl\b/i,
      /\bwget\b/i,
    ],
    packages: [],
  },
  {
    name: 'websocket-egress',
    description: 'Transmits data over WebSocket connections',
    patterns: [
      /websocket/i,
      /\bws:\/\//i,
      /\bwss:\/\//i,
    ],
    packages: [],
  },
];

export const TEMP_STORAGE_PATTERNS: RegExp[] = [
  /\/tmp\b/,
  /\/var\/tmp\b/,
  /\/var\/folders\b/,
  /os\.tmpdir/i,
  /temp(?:orary)?[-_]?(?:dir|file|path)/i,
];

/** Env var key patterns that indicate credential-like values */
export const CREDENTIAL_ENV_PATTERNS: RegExp[] = [
  /api[_-]?key/i,
  /[_-]?token[_-]?/i,
  /secret[_-]?/i,
  /password[_-]?/i,
  /[_-]?auth[_-]?/i,
  /credential[_-]?/i,
  /private[_-]?key/i,
  /access[_-]?key/i,
  /client[_-]?secret/i,
  /[_-]?passphrase/i,
];
