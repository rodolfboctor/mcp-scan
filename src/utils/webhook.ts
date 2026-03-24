import { ScanReport } from '../types/scan-result.js';
import { logger } from './logger.js';

/**
 * Sends the scan report to a generic webhook URL.
 * @param url The webhook URL.
 * @param report The scan report.
 */
export async function sendWebhook(url: string, report: ScanReport) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });

    if (!response.ok) {
      logger.error(`Webhook: Failed to send report to ${url}. Status: ${response.status} ${response.statusText}`);
    } else {
      logger.pass(`Webhook: Report successfully sent to ${url}.`);
    }
  } catch (error) {
    logger.error(`Webhook: Error sending report to ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Sends a summary of the scan report to a Slack webhook URL.
 * @param url The Slack webhook URL.
 * @param report The scan report.
 */
export async function sendSlackWebhook(url: string, report: ScanReport) {
  try {
    const totalFindings = report.criticalCount + report.highCount + report.mediumCount + report.lowCount + report.infoCount;
    const isAllClear = totalFindings === 0;
    
    const color = report.criticalCount > 0 ? '#F85149' : 
                  report.highCount > 0 ? '#F0883E' :
                  report.mediumCount > 0 ? '#D29922' : 
                  '#3FB950';

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🛡️ mcp-scan: ${isAllClear ? 'All Clear' : 'Security Findings Detected'}`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Scan Summary for ${report.results.length} servers:*`
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Critical:* ${report.criticalCount}` },
          { type: 'mrkdwn', text: `*High:* ${report.highCount}` },
          { type: 'mrkdwn', text: `*Medium:* ${report.mediumCount}` },
          { type: 'mrkdwn', text: `*Low:* ${report.lowCount}` }
        ]
      }
    ];

    if (!isAllClear) {
      const topFindings = report.results
        .filter(r => r.findings.length > 0)
        .slice(0, 5) // Top 5 servers with findings
        .map(r => `• *${r.serverName}* (${r.toolName}): ${r.findings.length} findings`)
        .join('\n');
      
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Top server findings:*\n${topFindings}`
        }
      });
    }

    const payload = {
      attachments: [
        {
          color: color,
          blocks: blocks
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      logger.error(`Slack Webhook: Failed to send to ${url}. Status: ${response.status} ${response.statusText}`);
    } else {
      logger.pass(`Slack Webhook: Notification successfully sent.`);
    }
  } catch (error) {
    logger.error(`Slack Webhook: Error sending to ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
