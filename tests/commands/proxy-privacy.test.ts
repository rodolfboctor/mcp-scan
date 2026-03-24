import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runProxy } from '../../src/commands/proxy.js';
import { loadPolicy } from '../../src/config/parser.js';
import { spawn } from 'child_process';
import { PassThrough } from 'stream';

vi.mock('../../src/config/parser.js', async () => {
    const actual = await vi.importActual('../../src/config/parser.js') as any;
    return {
        ...actual,
        loadPolicy: vi.fn(),
    };
});

vi.mock('child_process', () => ({
  spawn: vi.fn()
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    brand: vi.fn(),
    info: vi.fn(),
    detail: vi.fn(),
    error: vi.fn(),
  }
}));

describe('Proxy Privacy Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mask PII when enabled in policy', async () => {
    vi.mocked(loadPolicy).mockReturnValue({
      privacy: { maskPii: true }
    });

    const mockChildProcess = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
      on: vi.fn(),
      kill: vi.fn()
    };
    
    vi.mocked(spawn).mockReturnValue(mockChildProcess as any);

    // Provide a mocked process.stdin and stdout for runProxy
    const originalStdin = process.stdin;
    const originalStdout = process.stdout;
    
    // We only need to check what gets written to child's stdin
    
    const promise = runProxy({ command: 'node', args: '-v' });

    // Client -> Server direction
    const sensitivePayload = JSON.stringify({ method: 'test', params: { email: 'user@example.com' } }) + '\n';
    
    let capturedInput = '';
    mockChildProcess.stdin.on('data', (chunk) => {
        capturedInput += chunk.toString();
    });

    // Write to process.stdin simulation (interceptor wraps it)
    process.stdin.emit('data', Buffer.from(sensitivePayload));

    // Restore
    // process.stdin = originalStdin;
    // process.stdout = originalStdout;

    // Small delay to allow stream to flush
    await new Promise(r => setTimeout(r, 50));
    
    expect(capturedInput).toContain('[EMAIL_MASKED]');
    expect(capturedInput).not.toContain('user@example.com');
    
    // Cleanup
    // mockChildProcess.on.mock.calls.find(c => c[0] === 'exit')?.[1](0);
  });
});
