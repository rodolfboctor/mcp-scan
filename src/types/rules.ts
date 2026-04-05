import { Severity } from './severity.js';

export interface CustomRule {
  id: string;
  severity: Severity;
  description: string;
  fixRecommendation?: string;
  pattern: string; // regex string
  target: 'env' | 'args' | 'command' | 'url' | 'name';
  /** If true, the rule matches when the pattern does NOT match (inverted logic) */
  negate?: boolean;
}
