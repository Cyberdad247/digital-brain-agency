import { SecurityConfig, SecurityAnalysisResult } from '../../../types/security';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';

export class SecurityAnalyzer {
  private config: SecurityConfig;

  private securityPatterns: any;

  constructor(config: SecurityConfig) {
    this.config = config;
    // Initialize security patterns if not provided in config
    this.securityPatterns = {
      ciCdVulnerabilities: /(aws-access-key|api-key|secret-token|password|\$\{?SECRET_)/gi,
      insecurePermissions: /\.(sh|exe|bat)$/i,
      sensitiveFiles: /(\.env$|\.pem$|\.crt$|\.key$|\.pgp$|\.passwd$)/i
    };
    
    // Ensure config has securityPatterns initialized
    if (!this.config.securityPatterns) {
      this.config.securityPatterns = {
        sensitiveFiles: this.securityPatterns.sensitiveFiles,
        configFiles: /\.(json|yaml|yml|xml|ini|conf|config)$/i,
        tempFiles: /\.(tmp|temp|bak|old|swp)$/i,
        logFiles: /\.(log|logs)$/i
      };
    }
  }

  async analyze(rootDir: string): Promise<SecurityAnalysisResult> {
    await this.validateCICDConfigurations(rootDir);
    const result: SecurityAnalysisResult = {
      securityIssues: [],
      metrics: {
        totalFiles: 0,
        filesWithIssues: 0,
        averageComplexity: 0,
        testCoverage: 0,
      },
      recommendations: [],
    };

    try {
      // Get all files in the directory
      const files = await this.getAllFiles(rootDir);
      result.metrics.totalFiles = files.length;

      // Analyze each file
      let processedFiles = 0;
      for (const file of files) {
        const issues = await this.analyzeFile(file);
        if (issues.length > 0) {
          result.securityIssues.push(...issues);
          result.metrics.filesWithIssues++;
        }
        // Progress reporting
        processedFiles++;
        if (processedFiles % 10 === 0) {
          const progress = Math.round((processedFiles / files.length) * 100);
          console.log(`Analysis progress: ${progress}% complete`);
        }
      }
      console.log('File analysis complete. Calculating metrics...');

      // Calculate metrics
      await this.calculateMetrics(result);

      // Generate recommendations
      this.generateRecommendations(result);

      return result;
    } catch (error) {
      console.error('Error during security analysis:', error);
      throw error;
    }
  }

  private async validateCICDConfigurations(rootDir: string): Promise<SecurityAnalysisResult['securityIssues']> {
    const ciCdFiles = await this.getAllFiles(path.join(rootDir, '.github/workflows'));
    const issues: SecurityAnalysisResult['securityIssues'] = [];
    
    for (const file of ciCdFiles) {
      const content = await fs.readFile(file, 'utf8');
      
      if (this.securityPatterns.ciCdVulnerabilities.test(content)) {
        issues.push({
          filePath: file,
          issueType: 'sensitive',
          severity: 'high',
          description: 'Potential secret exposure in CI/CD pipeline configuration'
        });
      }
    }
    
    return issues;
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const excludedDirs = this.config.excludedDirs || [];

    const traverse = async (currentDir: string) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !excludedDirs.includes(entry.name)) {
          await traverse(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    };

    await traverse(dir);
    return files;
  }

  private async analyzeFile(
    filePath: string
  ): Promise<Array<SecurityAnalysisResult['securityIssues'][0]>> {
    const issues: Array<SecurityAnalysisResult['securityIssues'][0]> = [];
    const fileName = path.basename(filePath);

    // Check file patterns
    if (this.config.securityPatterns.sensitiveFiles.test(fileName)) {
      issues.push({
        filePath,
        issueType: 'sensitive',
        severity: 'high',
        description: 'Sensitive file detected. Consider securing or removing this file.',
        remediationScript: `#!/bin/bash
mv ${filePath} ./secure-vault/$(basename ${filePath})-$(date +%s).bak`
      });
    }

    // Generate dependency update script for outdated packages
    if (filePath.endsWith('package.json')) {
      issues.push({
        filePath,
        issueType: 'dependency',
        severity: 'medium',
        description: 'Outdated dependencies detected',
        remediationScript: 'npm update --save && npm audit fix'
      });
    }

    // Generate permission fix script
    if (this.securityPatterns.insecurePermissions.test(fileName)) {
      issues.push({
        filePath,
        issueType: 'permissions',
        severity: 'medium',
        description: 'Insecure file permissions detected',
        remediationScript: `chmod 600 ${filePath}`
      });
    }
    if (this.config.securityPatterns.configFiles.test(fileName)) {
      issues.push({
        filePath,
        issueType: 'config',
        severity: 'medium',
        description: 'Configuration file detected. Ensure no sensitive data is exposed.',
      });
    }

    // Check file size
    const stats = await fs.stat(filePath);
    if (stats.size > this.config.thresholds.maxFileSize) {
      issues.push({
        filePath,
        issueType: 'temp',
        severity: 'low',
        description: `File size exceeds ${this.config.thresholds.maxFileSize} bytes.`,
      });
    }

    return issues;
  }

  private async calculateMetrics(result: SecurityAnalysisResult): Promise<void> {
    try {
      const coverageReport = await fs.readFile('coverage/coverage-summary.json', 'utf-8');
      const coverageData = JSON.parse(coverageReport);
      result.metrics.testCoverage = coverageData.total.lines.pct;

      // Calculate average complexity from static analysis
      const complexityReport = await fs.readFile('complexity-report.json', 'utf-8');
      result.metrics.averageComplexity = JSON.parse(complexityReport).average;    
    } catch (error) {
      console.warn('Metric calculation warning:', error instanceof Error ? error.message : String(error));
      result.metrics.testCoverage = 0;
      result.metrics.averageComplexity = 0;
    }
  }

  private generateRecommendations(result: SecurityAnalysisResult) {
    // Generate automated remediation scripts
    result.securityIssues.forEach(issue => {
      if (issue.remediationScript) {
        result.recommendations.push({
          category: 'security',
          priority: 'high',
          description: `Automated fix available for ${issue.issueType} issue`,
          remediationScript: issue.remediationScript
        });
      }
    });

    // Add general recommendations
    if (result.metrics.envValidationPassed === false) {
      result.recommendations.push({
        category: 'security',
        priority: 'high',
        description: 'Environment validation failed - review configuration',
        suggestedFix: 'Check environment variables and config files'
      });
    }
  }

  private async getTestCoverage(): Promise<number> {
    return new Promise((resolve, reject) => {
      exec('npx jest --coverage --coverageReporters="json-summary"', (error, stdout) => {
        if (error && error.code !== 1) {
          resolve(0); // Default to 0 if coverage cannot be determined
        } else {
          try {
            const coverage = JSON.parse(stdout);
            resolve(coverage.total.lines.pct || 0);
          } catch {
            resolve(0);
          }
        }
      });
    });
  }
}
