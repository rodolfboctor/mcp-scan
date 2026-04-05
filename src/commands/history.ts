import { readAuditLog } from '../utils/audit-logger.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * Shows historical trends and common findings from the audit log.
 */
export async function showHistoryTrends() {
  const entries = readAuditLog(100); // Read more for trends

  if (entries.length === 0) {
    logger.info('No scan history found.');
    return;
  }

  logger.brand('Scan History Trends & Statistics:');
  logger.emptyLine();

  // 1. Scans per day
  const scansByDay: Record<string, number> = {};
  entries.forEach(e => {
    const day = new Date(e.timestamp).toLocaleDateString();
    scansByDay[day] = (scansByDay[day] || 0) + 1;
  });

  const sparkline = generateSparkline(Object.values(scansByDay).reverse().slice(-20));
  logger.log(`${chalk.bold('Scans per day (last 20 days):')} ${sparkline}`);

  // 2. Finding trends
  const criticalTrend = entries.map(e => e.findings.critical + e.findings.high).reverse().slice(-20);
  const criticalSparkline = generateSparkline(criticalTrend);
  logger.log(`${chalk.bold('High/Critical findings trend:  ')} ${chalk.red(criticalSparkline)}`);
  logger.emptyLine();

  // 3. Common finding types (Top 5)
  // Note: our audit log currently doesn't store individual finding IDs, 
  // but it does store server names. Let's show most frequently scanned/flagged servers.
  const serverFrequency: Record<string, number> = {};
  entries.forEach(e => {
    e.servers.forEach((s: string) => {
      serverFrequency[s] = (serverFrequency[s] || 0) + 1;
    });
  });

  const topServers = Object.entries(serverFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topServers.length > 0) {
    logger.info('Most Frequently Scanned Servers:');
    topServers.forEach(([name, count]) => {
      logger.log(`  • ${chalk.white.bold(name)} (${count} times)`);
    });
    logger.emptyLine();
  }

  // 4. Summary Stats
  const totalScanned = entries.reduce((sum, e) => sum + e.scannedCount, 0);
  const avgFindings = entries.reduce((sum, e) => sum + e.findings.critical + e.findings.high + e.findings.medium, 0) / entries.length;

  const cleanScans = entries.filter(e => e.findings.critical === 0 && e.findings.high === 0 && e.findings.medium === 0).length;
  const cleanPct = entries.length > 0 ? ((cleanScans / entries.length) * 100).toFixed(0) : '0';

  const statsTable = new Table({
    style: { head: ['cyan'] }
  });

  statsTable.push(
    { 'Total Scans': entries.length },
    { 'Total Servers Analyzed': totalScanned },
    { 'Clean Scans (no findings)': `${cleanScans} (${cleanPct}%)` },
    { 'Avg. Findings per Scan': avgFindings.toFixed(1) },
    { 'Oldest Scan': new Date(entries[entries.length - 1].timestamp).toLocaleString() },
    { 'Latest Scan': new Date(entries[0].timestamp).toLocaleString() }
  );

  logger.log(statsTable.toString());
}

/**
 * Generates a simple unicode sparkline from an array of numbers.
 */
function generateSparkline(data: number[]): string {
  if (data.length === 0) return '';
  const ticks = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return data.map(v => {
    if (range === 0) return ticks[4];
    const index = Math.floor(((v - min) / range) * (ticks.length - 1));
    return ticks[index];
  }).join('');
}
