import { spawn } from 'child_process';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Transform } from 'stream';
import { loadPolicy } from '../config/parser.js';
import { maskPii, PrivacyOptions } from '../utils/privacy-engine.js';

class JsonRpcInterceptor extends Transform {
  private buffer: string = '';
  private direction: string;
  private logStream: fs.WriteStream;
  private privacyOptions?: PrivacyOptions;
  private dashboardCallback?: (dir: string, msg: string, pii: boolean) => void;

  constructor(direction: string, logStream: fs.WriteStream, privacyOptions?: PrivacyOptions, dashboardCallback?: (dir: string, msg: string, pii: boolean) => void) {
    super();
    this.direction = direction;
    this.logStream = logStream;
    this.privacyOptions = privacyOptions;
    this.dashboardCallback = dashboardCallback;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    this.buffer += chunk.toString();
    
    let lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep the incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          let json = JSON.parse(line);
          this.logStream.write(`[${this.direction}] ${JSON.stringify(json)}\n`);
          
          let piiMasked = false;
          if (this.privacyOptions) {
            const originalStr = JSON.stringify(json);
            json = maskPii(json, this.privacyOptions);
            if (originalStr !== JSON.stringify(json)) {
               piiMasked = true;
            }
          }
          
          const finalMsg = JSON.stringify(json);
          if (this.dashboardCallback) this.dashboardCallback(this.direction, finalMsg, piiMasked);
          
          this.push(finalMsg + '\n');
        } catch (e) {
          // If not valid JSON, just pass through and log as raw
          this.logStream.write(`[${this.direction} RAW] ${line}\n`);
          if (this.dashboardCallback) this.dashboardCallback(this.direction + ' RAW', line, false);
          this.push(line + '\n');
        }
      }
    }
    callback();
  }

  _flush(callback: any) {
    if (this.buffer.trim()) {
      this.push(this.buffer);
    }
    callback();
  }
}

export async function runProxy(options: { command?: string, args?: string, ui?: boolean }) {
  if (!options.command) {
    logger.error('No command specified for proxy. Use --command <cmd>.');
    process.exit(1);
  }

  let dashboardCallback: undefined | ((dir: string, msg: string, pii: boolean) => void);
  if (options.ui) {
      const { createDashboard } = await import('../utils/dashboard-ui.js');
      const dashboard = createDashboard();
      dashboard.switchView('PROXY');
      dashboardCallback = dashboard.appendProxyLog;
      logger.isSilent = true; // suppress normal logging if UI is active
  } else {
      logger.brand('MCP Guard Proxy Active');
      const args = options.args ? (options.args.includes(',') ? options.args.split(',') : options.args.split(' ')) : [];
      logger.info(`Proxying: ${options.command} ${args.join(' ')}`);
  }

  const args = options.args ? (options.args.includes(',') ? options.args.split(',') : options.args.split(' ')) : [];

  const policy = loadPolicy();
  let privacyOpts: PrivacyOptions | undefined;
  
  if (policy?.privacy?.maskPii) {
    logger.info('Data Privacy Engine: Enabled');
    privacyOpts = {
      disabledPatterns: policy.privacy.excludePatterns
    };
  } else {
    logger.info('Data Privacy Engine: Disabled');
  }

  const logDir = path.join(os.homedir(), '.mcp-scan', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFile = path.join(logDir, `proxy-${Date.now()}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  logger.detail(`Audit log: ${logFile}`);

  const child = spawn(options.command, args, {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const clientInterceptor = new JsonRpcInterceptor('CLIENT -> SERVER', logStream, privacyOpts, dashboardCallback);
  const serverInterceptor = new JsonRpcInterceptor('SERVER -> CLIENT', logStream, privacyOpts, dashboardCallback);

  process.stdin.pipe(clientInterceptor).pipe(child.stdin);
  child.stdout.pipe(serverInterceptor).pipe(process.stdout);

  child.on('exit', (code) => {
    logger.info(`Server exited with code ${code}`);
    logStream.end();
    process.exit(code || 0);
  });

  child.on('error', (err) => {
    logger.error(`Failed to start server: ${err.message}`);
    logStream.end();
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down proxy...');
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });
}
