import fs from 'fs';
import path from 'path';

export function atomicWriteConfig(configPath: string, content: string): void {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tempPath = `${configPath}.tmp-${Date.now()}`;
  const backupPath = `${configPath}.backup`;

  // Create backup if target exists
  if (fs.existsSync(configPath)) {
    try {
      fs.copyFileSync(configPath, backupPath);
    } catch (_err) {
      // Ignore backup failures (e.g. read-only)
    }
  }

  try {
    // Write to temp
    fs.writeFileSync(tempPath, content, 'utf8');
    // Rename temp to target (atomic on most systems)
    fs.renameSync(tempPath, configPath);
  } catch (error) {
    // Cleanup temp if it failed
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_err) {}
    }
    throw error;
  }
}
