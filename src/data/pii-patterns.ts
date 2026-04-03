export interface PiiPattern {
  name: string;
  regex: RegExp;
  mask: string;
}

export const PII_PATTERNS: PiiPattern[] = [
  {
    name: 'Email',
    regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
    mask: '[EMAIL_MASKED]'
  },
  {
    name: 'Phone Number',
    regex: /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}\b/g,
    mask: '[PHONE_MASKED]'
  },
  {
    name: 'Credit Card',
    regex: /\b(?:\d[ -]*?){13,16}\b/g,
    mask: '[CREDIT_CARD_MASKED]'
  },
  {
    name: 'SSN',
    regex: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    mask: '[SSN_MASKED]'
  },
  {
    name: 'IPv4 Address',
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    mask: '[IP_MASKED]'
  },
  {
    name: 'IBAN',
    regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}\b/g,
    mask: '[IBAN_MASKED]'
  },
  {
    name: 'Password',
    regex: /password[_-]?\b[A-Za-z0-9!@#$%^&*()_+]{8,}\b/i,
    mask: '[PASSWORD_MASKED]'
  },
  {
    name: 'API Key',
    regex: /\b(?:[A-Za-z0-9]{24,64})\b/i,
    mask: '[API_KEY_MASKED]'
  },
  {
    name: 'Zip Code',
    regex: /\b\d{5}(?:-\d{4})?\b/g,
    mask: '[ZIP_MASKED]'
  },
  {
    name: 'VAT Number',
    regex: /\b[A-Z]{2}[0-9A-Z]{2,12}\b/g,
    mask: '[VAT_MASKED]'
  }
];
