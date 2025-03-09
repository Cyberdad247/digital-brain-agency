import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class BackupManager {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.backupDir = path.join(rootDir, '.backup');
    this.logFile = path.join(this.backupDir, 'backup-log.json');
  }

  async createBackup() {
    console.log('Creating backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }

    // Create backup folder
    fs.mkdirSync(backupPath);

    // Initialize log
    const log = {
      timestamp,
      files: [],
      checksums: {},
    };

    // Copy files and calculate checksums
    await this._copyFilesRecursively(this.rootDir, backupPath, log);

    // Save log
    fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));

    console.log(`Backup created at: ${backupPath}`);
    return backupPath;
  }

  async _copyFilesRecursively(source, target, log, relativePath = '') {
    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      const relPath = path.join(relativePath, entry.name);

      // Skip backup directory and node_modules
      if (entry.name === '.backup' || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        fs.mkdirSync(targetPath, { recursive: true });
        await this._copyFilesRecursively(srcPath, targetPath, log, relPath);
      } else {
        // Copy file and calculate checksum
        fs.copyFileSync(srcPath, targetPath);
        const checksum = this._calculateChecksum(srcPath);
        log.files.push(relPath);
        log.checksums[relPath] = checksum;
      }
    }
  }

  _calculateChecksum(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }

  async restore(backupPath) {
    console.log('Restoring from backup...');

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup path does not exist: ${backupPath}`);
    }

    // Read backup log
    const log = JSON.parse(fs.readFileSync(this.logFile));

    // Verify and restore files
    for (const relPath of log.files) {
      const srcPath = path.join(backupPath, relPath);
      const targetPath = path.join(this.rootDir, relPath);

      // Create directory if needed
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy file back
      fs.copyFileSync(srcPath, targetPath);

      // Verify checksum
      const currentChecksum = this._calculateChecksum(targetPath);
      if (currentChecksum !== log.checksums[relPath]) {
        throw new Error(`Checksum mismatch for file: ${relPath}`);
      }
    }

    console.log('Restore completed successfully');
  }
}

export default BackupManager;
