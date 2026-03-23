import fs from 'fs';
import path from 'path';

export function atomicWriteConfig(configPath: string, content: string): void {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = Date.now();
  const backupPath = `${configPath}.backup-${timestamp}`;
  const tempPath = `${configPath}.tmp-${timestamp}`;

  // Backup if exists
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
  }

  try {
    // Write to temp
    fs.writeFileSync(tempPath, content, 'utf8');
    // Rename temp to target
    fs.renameSync(tempPath, configPath);
  } catch (error) {
    // Cleanup temp if it failed
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}
