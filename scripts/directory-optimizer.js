import fs from 'fs';
import path from 'path';
import BackupManager from './backup-and-restore.js';

class DirectoryOptimizer {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.backupManager = new BackupManager(rootDir);
    this.securityRisks = [];
    this.redundantFiles = [];
    this.optimizationLog = [];
  }

  async optimize() {
    // Create backup before making changes
    const backupPath = await this.backupManager.createBackup();
    console.log('Backup created successfully');

    try {
      // Kaiyo Takeda: Security Analysis
      await this.performSecurityAnalysis();

      // OfficeAnchor: Directory Structure Optimization
      await this.standardizeFolderStructure();

      // WordWeaver: Content Optimization
      await this.optimizeContent();

      // CRMBeacon: Data Management
      await this.optimizeCRMData();

      // Generate optimization report
      this.generateReport();
    } catch (error) {
      console.error('Error during optimization:', error);
      await this.backupManager.restore(backupPath);
      throw error;
    }
  }

  async performSecurityAnalysis() {
    console.log('Performing security analysis...');
    const securityPatterns = {
      vulnerableFiles: /\.(env|key|pem|crt|p12|pfx|password)$/i,
      outdatedDeps: /(package-lock\.json|yarn\.lock)$/,
      tempFiles: /\.(tmp|temp|bak|old|swp)$/i,
    };

    this._scanForSecurityIssues(this.rootDir, securityPatterns);
  }

  _scanForSecurityIssues(dir, patterns) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (file !== 'node_modules' && file !== '.git') {
          this._scanForSecurityIssues(fullPath, patterns);
        }
      } else {
        // Check for security risks
        for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(file)) {
            this.securityRisks.push({
              path: fullPath,
              type: type,
            });
          }
        }
      }
    }
  }

  async standardizeFolderStructure() {
    console.log('Standardizing folder structure...');
    const standardFolders = ['src', 'docs', 'tests', 'config', 'scripts', 'assets', 'public'];

    // Create standard folders if they don't exist
    for (const folder of standardFolders) {
      const folderPath = path.join(this.rootDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        this.optimizationLog.push(`Created standard folder: ${folder}`);
      }
    }
  }

  async optimizeContent() {
    console.log('Optimizing content...');
    const contentPatterns = {
      duplicates: /\.(copy|\d+)\./i,
      drafts: /\.(draft|wip)\./i,
      temp: /~$/,
    };

    this._scanForRedundantContent(this.rootDir, contentPatterns);
  }

  _scanForRedundantContent(dir, patterns) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          this._scanForRedundantContent(fullPath, patterns);
        }
      } else {
        for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(file)) {
            this.redundantFiles.push({
              path: fullPath,
              type: type,
            });
          }
        }
      }
    }
  }

  async optimizeCRMData() {
    console.log('Optimizing CRM data...');
    const crmPatterns = {
      oldData: /\.(old|deprecated)\.json$/i,
      brokenScripts: /\.(broken|invalid)\.js$/i,
    };

    this._scanForCRMIssues(this.rootDir, crmPatterns);
  }

  _scanForCRMIssues(dir, patterns) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          this._scanForCRMIssues(fullPath, patterns);
        }
      } else {
        for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(file)) {
            this.redundantFiles.push({
              path: fullPath,
              type: `crm_${type}`,
            });
          }
        }
      }
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      securityIssues: this.securityRisks,
      redundantFiles: this.redundantFiles,
      optimizationSteps: this.optimizationLog,
    };

    const reportPath = path.join(this.rootDir, 'optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Optimization report generated at: ${reportPath}`);
  }
}

export default DirectoryOptimizer;
