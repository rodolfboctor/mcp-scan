import { describe, it, expect } from 'vitest';
import { scanSecrets } from '../../src/scanners/secret-scanner.js';
import { scanPermissions } from '../../src/scanners/permission-scanner.js';
import { scanRegistry } from '../../src/scanners/registry-scanner.js';
import { scanTyposquat } from '../../src/scanners/typosquat-scanner.js';
import { scanTransport } from '../../src/scanners/transport-scanner.js';
import { scanConfig } from '../../src/scanners/config-scanner.js';
import { scanAst } from '../../src/scanners/ast-scanner.js';
import { scanPromptInjection } from '../../src/scanners/prompt-injection-scanner.js';
import { scanToolPoisoning } from '../../src/scanners/tool-poisoning-scanner.js';
import { scanEnvLeak } from '../../src/scanners/env-leak-scanner.js';
import { scanSupplyChain } from '../../src/scanners/supply-chain-scanner.js';
import { scanPackageDeep } from '../../src/scanners/package-scanner.js';
import { ResolvedServer } from '../../src/types/config.js';

describe('Scanner Robustness', () => {
  const urlOnlyServer: ResolvedServer = {
    name: 'test',
    toolName: 'test',
    configPath: 'test.json',
    url: 'http://example.com/sse',
    type: 'sse'
  };

  const noArgsServer: ResolvedServer = {
    name: 'test',
    toolName: 'test',
    configPath: 'test.json',
    command: 'node'
  };

  const noEnvServer: ResolvedServer = {
    name: 'test',
    toolName: 'test',
    configPath: 'test.json',
    command: 'node',
    args: ['index.js']
  };

  const emptyServer: ResolvedServer = {
    name: 'test',
    toolName: 'test',
    configPath: 'test.json'
  };

  it('should not crash on URL-only server (no command, no args)', async () => {
    expect(() => scanSecrets(urlOnlyServer)).not.toThrow();
    expect(() => scanPermissions(urlOnlyServer)).not.toThrow();
    expect(() => scanRegistry(urlOnlyServer)).not.toThrow();
    expect(() => scanTyposquat(urlOnlyServer)).not.toThrow();
    expect(() => scanTransport(urlOnlyServer)).not.toThrow();
    expect(() => scanConfig(urlOnlyServer)).not.toThrow();
    expect(() => scanAst(urlOnlyServer)).not.toThrow();
    expect(() => scanPromptInjection(urlOnlyServer)).not.toThrow();
    expect(() => scanToolPoisoning(urlOnlyServer)).not.toThrow();
    expect(() => scanEnvLeak(urlOnlyServer, 'test.json')).not.toThrow();
    await expect(scanSupplyChain(urlOnlyServer, true)).resolves.toBeDefined();
    await expect(scanPackageDeep(urlOnlyServer, true)).resolves.toBeDefined();
  });

  it('should not crash on no-args server', async () => {
    expect(() => scanSecrets(noArgsServer)).not.toThrow();
    expect(() => scanPermissions(noArgsServer)).not.toThrow();
    expect(() => scanRegistry(noArgsServer)).not.toThrow();
    expect(() => scanTyposquat(noArgsServer)).not.toThrow();
    expect(() => scanTransport(noArgsServer)).not.toThrow();
    expect(() => scanConfig(noArgsServer)).not.toThrow();
    expect(() => scanAst(noArgsServer)).not.toThrow();
    expect(() => scanPromptInjection(noArgsServer)).not.toThrow();
    expect(() => scanToolPoisoning(noArgsServer)).not.toThrow();
    expect(() => scanEnvLeak(noArgsServer, 'test.json')).not.toThrow();
    await expect(scanSupplyChain(noArgsServer, true)).resolves.toBeDefined();
    await expect(scanPackageDeep(noArgsServer, true)).resolves.toBeDefined();
  });

  it('should not crash on no-env server', async () => {
    expect(() => scanSecrets(noEnvServer)).not.toThrow();
    expect(() => scanPermissions(noEnvServer)).not.toThrow();
    expect(() => scanRegistry(noEnvServer)).not.toThrow();
    expect(() => scanTyposquat(noEnvServer)).not.toThrow();
    expect(() => scanTransport(noEnvServer)).not.toThrow();
    expect(() => scanConfig(noEnvServer)).not.toThrow();
    expect(() => scanAst(noEnvServer)).not.toThrow();
    expect(() => scanPromptInjection(noEnvServer)).not.toThrow();
    expect(() => scanToolPoisoning(noEnvServer)).not.toThrow();
    expect(() => scanEnvLeak(noEnvServer, 'test.json')).not.toThrow();
    await expect(scanSupplyChain(noEnvServer, true)).resolves.toBeDefined();
    await expect(scanPackageDeep(noEnvServer, true)).resolves.toBeDefined();
  });

  it('should not crash on completely empty server', async () => {
    expect(() => scanSecrets(emptyServer)).not.toThrow();
    expect(() => scanPermissions(emptyServer)).not.toThrow();
    expect(() => scanRegistry(emptyServer)).not.toThrow();
    expect(() => scanTyposquat(emptyServer)).not.toThrow();
    expect(() => scanTransport(emptyServer)).not.toThrow();
    expect(() => scanConfig(emptyServer)).not.toThrow();
    expect(() => scanAst(emptyServer)).not.toThrow();
    expect(() => scanPromptInjection(emptyServer)).not.toThrow();
    expect(() => scanToolPoisoning(emptyServer)).not.toThrow();
    expect(() => scanEnvLeak(emptyServer, 'test.json')).not.toThrow();
    await expect(scanSupplyChain(emptyServer, true)).resolves.toBeDefined();
    await expect(scanPackageDeep(emptyServer, true)).resolves.toBeDefined();
  });
});