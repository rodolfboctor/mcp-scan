import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendWebhook, sendSlackWebhook } from '../../src/utils/webhook.js';
import { ScanReport } from '../../src/types/scan-result.js';

describe('webhook utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const mockReport: ScanReport = {
    results: [],
    totalScanned: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalDurationMs: 10,
    version: '1.0.3'
  };

  it('should send a generic webhook POST request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as any);
    
    await sendWebhook('https://example.com/webhook', mockReport);
    
    expect(fetch).toHaveBeenCalledWith('https://example.com/webhook', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockReport)
    }));
  });

  it('should send a Slack-formatted webhook POST request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as any);
    
    await sendSlackWebhook('https://hooks.slack.com/services/...', mockReport);
    
    expect(fetch).toHaveBeenCalledWith('https://hooks.slack.com/services/...', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }));
    
    const callArgs = vi.mocked(fetch).mock.calls[0][1] as any;
    const body = JSON.parse(callArgs.body);
    expect(body).toHaveProperty('attachments');
    expect(body.attachments[0]).toHaveProperty('blocks');
    expect(body.attachments[0].color).toBe('#3FB950'); // All clear color
  });

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    
    await expect(sendWebhook('https://example.com/webhook', mockReport)).resolves.not.toThrow();
  });
});
