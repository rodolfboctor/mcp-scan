import { Finding } from '../types/scan-result.js';

// Stub for local AST/regex scanning during deep audit
export async function scanAst(): Promise<Finding[]> {
  // In a full implementation, this would look for the local module and run regex/AST analysis
  return [];
}
