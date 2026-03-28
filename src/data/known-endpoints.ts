export const KNOWN_ENDPOINTS: Record<string, string[]> = {
  telemetry: [
    'api.segment.io',
    'api.mixpanel.com',
    'google-analytics.com',
    'app.posthog.com',
    'api.amplitude.com',
    'telemetry'
  ],
  api: [
    'api.openai.com',
    'api.anthropic.com',
    'api.github.com',
    'api.hubapi.com'
  ],
  cdn: [
    'unpkg.com',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com'
  ],
  suspicious: [
    'ngrok.io',
    'pastebin.com',
    'localtunnel.me'
  ]
};