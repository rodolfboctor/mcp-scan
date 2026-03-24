import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { ScanReport, ServerScanResult, Finding } from '../types/scan-result.js';

const AUDIT_LOG_DIR = path.join(os.homedir(), '.mcp-scan');
const AUDIT_LOG_FILE = path.join(AUDIT_LOG_DIR, 'audit.log');
const FINGERPRINT_FILE = path.join(AUDIT_LOG_DIR, 'known-servers.json');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Logs a scan result to the persistent audit log.
 */
export function logScan(report: ScanReport) {
  try {
    if (!fs.existsSync(AUDIT_LOG_DIR)) {
      fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
    }

    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const stats = fs.statSync(AUDIT_LOG_FILE);
      if (stats.size > MAX_LOG_SIZE) {
        const backupFile = `${AUDIT_LOG_FILE}.${Date.now()}.bak`;
        fs.renameSync(AUDIT_LOG_FILE, backupFile);
      }
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      user: os.userInfo().username,
      hostname: os.hostname(),
      version: report.version,
      durationMs: report.totalDurationMs,
      scannedCount: report.totalScanned,
      findings: {
        critical: report.criticalCount,
        high: report.highCount,
        medium: report.mediumCount,
        low: report.lowCount,
        info: report.infoCount
      },
      clients: [...new Set(report.results.map(r => r.toolName))],
      servers: report.results.map(r => r.serverName)
    };

    fs.appendFileSync(AUDIT_LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8');
    
    // Update fingerprints
    updateFingerprints(report.results);
  } catch (_error) {}
}

/**
 * Checks server fingerprints and returns mutation findings.
 */
export function checkFingerprints(results: ServerScanResult[]): Record<string, Finding[]> {
  const mutationFindings: Record<string, Finding[]> = {};
  try {
    if (!fs.existsSync(FINGERPRINT_FILE)) return mutationFindings;
    
    const knownFingerprints = JSON.parse(fs.readFileSync(FINGERPRINT_FILE, 'utf8'));
    
    for (const result of results) {
      const key = `${result.toolName}:${result.serverName}`;
      const currentFingerprint = generateFingerprint(result);
      
      if (knownFingerprints[key] && knownFingerprints[key] !== currentFingerprint) {
        mutationFindings[key] = [{
          id: 'server-mutation',
          severity: 'LOW',
          description: `Server configuration has changed since the last scan.`,
          fixRecommendation: 'Review the changes to ensure they are intentional and secure.'
        }];
      }
    }
  } catch (_error) {}
  return mutationFindings;
}

function updateFingerprints(results: ServerScanResult[]) {
  try {
    let fingerprints: Record<string, string> = {};
    if (fs.existsSync(FINGERPRINT_FILE)) {
      fingerprints = JSON.parse(fs.readFileSync(FINGERPRINT_FILE, 'utf8'));
    }

    for (const result of results) {
      const key = `${result.toolName}:${result.serverName}`;
      fingerprints[key] = generateFingerprint(result);
    }

    fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprints, null, 2), 'utf8');
  } catch (_error) {}
}

function generateFingerprint(result: any): string {
  // Use a subset of fields for fingerprinting
  const data = {
    command: result.command,
    args: result.args,
    envKeys: result.env ? Object.keys(result.env).sort() : [],
    packageName: result.metadata?.packageName,
    version: result.metadata?.version
  };
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export function readAuditLog(count: number = 20): any[] {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) return [];
    const content = fs.readFileSync(AUDIT_LOG_FILE, 'utf8');
    const lines = content.trim().split('\n');
    return lines.slice(-count).reverse().map(line => JSON.parse(line));
  } catch (_error) {
    return [];
  }
}
