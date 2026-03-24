import { PII_PATTERNS } from '../data/pii-patterns.js';

export interface PrivacyOptions {
  enabledPatterns?: string[]; // Names of patterns to enable. If empty/undefined, all are enabled.
  disabledPatterns?: string[]; // Names of patterns to explicitly disable.
}

/**
 * Masks PII in a given string.
 */
export function maskString(str: string, options?: PrivacyOptions): string {
  if (typeof str !== 'string') return str;

  let maskedStr = str;
  for (const pattern of PII_PATTERNS) {
    if (options?.enabledPatterns && options.enabledPatterns.length > 0) {
      if (!options.enabledPatterns.includes(pattern.name)) continue;
    }
    if (options?.disabledPatterns && options.disabledPatterns.includes(pattern.name)) {
      continue;
    }

    maskedStr = maskedStr.replace(pattern.regex, pattern.mask);
  }
  return maskedStr;
}

/**
 * Recursively masks PII in an object, array, or string.
 * Modifies objects in place for performance, but returns the value as well.
 */
export function maskPii(data: any, options?: PrivacyOptions): any {
  if (data == null) return data;

  if (typeof data === 'string') {
    return maskString(data, options);
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = maskPii(data[i], options);
    }
    return data;
  }

  if (typeof data === 'object') {
    for (const key of Object.keys(data)) {
      data[key] = maskPii(data[key], options);
    }
    return data;
  }

  return data;
}
