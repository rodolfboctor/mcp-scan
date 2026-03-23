export const SECRET_PATTERNS = [
  { name: 'GitHub Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Stripe Secret Key', regex: /sk_(live|test)_[0-9a-zA-Z]{24}/ },
  { name: 'Stripe Publishable Key', regex: /pk_(live|test)_[0-9a-zA-Z]{24}/ },
  { name: 'Anthropic API Key', regex: /sk-ant-api03-[a-zA-Z0-9_-]{93}/ },
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48,}/ },
  { name: 'Slack Token', regex: /xox[bps]-[0-9]{12}-[0-9]{12}/ },
  { name: 'Database URL with Credentials', regex: /[a-zA-Z]+:\/\/[^:]+:[^@]+@[^/]+/ },
  { name: 'Generic High Entropy Secret', regex: /[A-Za-z0-9_-]{40,}/ } // Generic fallback
];
