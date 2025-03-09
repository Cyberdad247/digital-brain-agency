import { SecurityConfig, SecurityAnalysisResult } from '../../../types/security';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';

export class SecurityAnalyzer {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  async analyze(rootDir: string): Promise<SecurityAnalysisResult> {
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
      for (const file of files) {
        const issues = await this.analyzeFile(file);
        if (issues.length > 0) {
          result.securityIssues.push(...issues);
          result.metrics.filesWithIssues++;
        }
      }

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

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    async function traverse(currentDir: string) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !this.config.excludedDirs.includes(entry.name)) {
          await traverse(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    }

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
    // Calculate average complexity
    const complexitySum = result.securityIssues.reduce((sum, issue) => {
      return sum + (issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1);
    }, 0);

    result.metrics.averageComplexity = complexitySum / (result.metrics.filesWithIssues || 1);

    // Get test coverage if available
    try {
      const coverage = await this.getTestCoverage();
      result.metrics.testCoverage = coverage;
    } catch (error) {
      console.warn('Could not determine test coverage:', error);
      result.metrics.testCoverage = 0;
    }
  }

  private generateRecommendations(result: SecurityAnalysisResult): void {
    // Add general recommendations based on issues found
    if (result.metrics.testCoverage < this.config.thresholds.minTestCoverage) {
      result.recommendations.push({
        category: 'maintenance',
        priority: 'high',
        description: 'Test coverage is below the minimum threshold',
        suggestedFix: 'Add more unit tests to improve code coverage',
      });
    }

    if (result.securityIssues.some((issue) => issue.severity === 'high')) {
      result.recommendations.push({
        category: 'security',
        priority: 'high',
        description: 'High severity security issues detected',
        suggestedFix: 'Review and address all high severity security issues',
      });
    }

    // Add performance recommendations
    if (result.metrics.averageComplexity > this.config.thresholds.maxComplexity) {
      result.recommendations.push({
        category: 'performance',
        priority: 'medium',
        description: 'Code complexity is above threshold',
        suggestedFix: 'Refactor complex code sections to improve maintainability',
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
