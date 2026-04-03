export const KNOWN_ENDPOINTS: Record<string, string[]> = {
  telemetry: [
    'api.segment.io',
    'api.mixpanel.com',
    'google-analytics.com',
    'app.posthog.com',
    'api.amplitude.com',
    'sentry.io',
    'logrocket.com',
    'hotjar.com',
    'datadoghq.com',
    'dynatrace.com',
    'telemetry'
  ],
  api: [
    'api.openai.com',
    'api.anthropic.com',
    'api.github.com',
    'api.hubapi.com',
    'api.mistral.ai',
    'generativelanguage.googleapis.com',
    'api.groq.com',
    'api.replicate.com'
  ],
  cdn: [
    'unpkg.com',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'skypack.dev',
    'esm.sh'
  ],
  suspicious: [
    'ngrok.io',
    'pastebin.com',
    'localtunnel.me',
    'webhook.site',
    'requestcatcher.com',
    'mocky.io',
    'ttrss.info'
  ]
};
