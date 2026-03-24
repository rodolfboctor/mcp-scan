import fs from 'fs';
import path from 'path';
import os from 'os';
import { ScanReport } from '../types/scan-result.js';

const AUDIT_LOG_DIR = path.join(os.homedir(), '.mcp-scan');
const AUDIT_LOG_FILE = path.join(AUDIT_LOG_DIR, 'audit.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Logs a scan result to the persistent audit log.
 * @param report The scan report.
 */
export function logScan(report: ScanReport) {
  try {
    if (!fs.existsSync(AUDIT_LOG_DIR)) {
      fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
    }

    // Check size and rotate if needed
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
  } catch (error) {
    // Fail silently for audit logging to not interrupt the scan
  }
}

/**
 * Reads the last N entries from the audit log.
 * @param count Number of entries to read.
 * @returns Array of log entries.
 */
export function readAuditLog(count: number = 20): any[] {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) return [];

    const content = fs.readFileSync(AUDIT_LOG_FILE, 'utf8');
    const lines = content.trim().split('\n');
    return lines.slice(-count).reverse().map(line => JSON.parse(line));
  } catch (error) {
    return [];
  }
}
