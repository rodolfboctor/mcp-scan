export interface PiiPattern {
  name: string;
  regex: RegExp;
  mask: string;
}

export const PII_PATTERNS: PiiPattern[] = [
  {
    name: 'Email',
    // High-performance email regex
    regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
    mask: '[EMAIL_MASKED]'
  },
  {
    name: 'Phone Number',
    // Common phone number formats (US-centric + international)
    regex: /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}\b/g,
    mask: '[PHONE_MASKED]'
  },
  {
    name: 'Credit Card',
    // Common credit card patterns (13-16 digits, with/out spaces)
    regex: /\b(?:\d[ -]*?){13,16}\b/g,
    mask: '[CREDIT_CARD_MASKED]'
  },
  {
    name: 'SSN',
    // US Social Security Number
    regex: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    mask: '[SSN_MASKED]'
  },
  {
    name: 'IPv4 Address',
    // Standard IPv4
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    mask: '[IP_MASKED]'
  }
];
