import { spawn } from 'child_process';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Transform } from 'stream';

class JsonRpcInterceptor extends Transform {
  private buffer: string = '';
  private direction: string;
  private logStream: fs.WriteStream;

  constructor(direction: string, logStream: fs.WriteStream) {
    super();
    this.direction = direction;
    this.logStream = logStream;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    this.buffer += chunk.toString();
    
    let lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep the incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);
          this.logStream.write(`[${this.direction}] ${JSON.stringify(json)}\n`);
          // Here we can eventually add sanitization logic
          this.push(JSON.stringify(json) + '\n');
        } catch (e) {
          // If not valid JSON, just pass through and log as raw
          this.logStream.write(`[${this.direction} RAW] ${line}\n`);
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

export async function runProxy(options: { command?: string, args?: string }) {
  if (!options.command) {
    logger.error('No command specified for proxy. Use --command <cmd>.');
    process.exit(1);
  }

  const args = options.args ? (options.args.includes(',') ? options.args.split(',') : options.args.split(' ')) : [];
  
  logger.brand('MCP Guard Proxy Active');
  logger.info(`Proxying: ${options.command} ${args.join(' ')}`);

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

  const clientInterceptor = new JsonRpcInterceptor('CLIENT -> SERVER', logStream);
  const serverInterceptor = new JsonRpcInterceptor('SERVER -> CLIENT', logStream);

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
