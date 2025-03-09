import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';

interface FileAnalysis {
  path: string;
  lastModified: Date;
  size: number;
  imports: string[];
  coverage?: number;
}

interface AnalysisReport {
  unusedFiles: string[];
  lowCoverageFiles: string[];
  largeFiles: string[];
  duplicateFiles: string[];
  suggestions: string[];
}

class DirectoryAnalyzer {
  private readonly ignoreDirs = ['.git', 'node_modules', 'dist', '.next', 'coverage'];
  private readonly OLD_FILE_THRESHOLD = 180; // 6 months in days
  private readonly LARGE_FILE_THRESHOLD = 500000; // 500KB
  private readonly LOW_COVERAGE_THRESHOLD = 5; // 5%

  async analyzeDirectory(rootDir: string): Promise<AnalysisReport> {
    const report: AnalysisReport = {
      unusedFiles: [],
      lowCoverageFiles: [],
      largeFiles: [],
      duplicateFiles: [],
      suggestions: [],
    };

    try {
      const files = await this.getAllFiles(rootDir);
      const analysisPromises = files.map((file) => this.analyzeFile(file));
      const analyses = await Promise.all(analysisPromises);

      for (const analysis of analyses) {
        if (!analysis) continue;

        const daysSinceModified = this.getDaysSinceModified(analysis.lastModified);
        if (daysSinceModified > this.OLD_FILE_THRESHOLD) {
          report.unusedFiles.push(analysis.path);
          report.suggestions.push(
            `Consider removing unused file: ${analysis.path} (Last modified ${daysSinceModified} days ago)`
          );
        }

        if (analysis.size > this.LARGE_FILE_THRESHOLD) {
          report.largeFiles.push(analysis.path);
          report.suggestions.push(
            `Large file detected: ${analysis.path} (${Math.round(analysis.size / 1024)}KB)`
          );
        }

        if (analysis.coverage !== undefined && analysis.coverage < this.LOW_COVERAGE_THRESHOLD) {
          report.lowCoverageFiles.push(analysis.path);
          report.suggestions.push(
            `Low test coverage: ${analysis.path} (${analysis.coverage}% coverage)`
          );
        }
      }

      // Run additional analysis tools
      await this.runESLint(rootDir);
      await this.checkDependencies(rootDir);

      return report;
    } catch (error) {
      console.error('Error analyzing directory:', error);
      throw error;
    }
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    async function traverse(currentDir: string) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !this.ignoreDirs.includes(entry.name)) {
          await traverse(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    }

    await traverse(dir);
    return files;
  }

  private async analyzeFile(filePath: string): Promise<FileAnalysis | null> {
    try {
      const stats = await fs.stat(filePath);
      const imports = await this.extractImports(filePath);
      const coverage = await this.getTestCoverage(filePath);

      return {
        path: filePath,
        lastModified: stats.mtime,
        size: stats.size,
        imports,
        coverage,
      };
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error);
      return null;
    }
  }

  private async extractImports(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"];?/g;
      const imports: string[] = [];
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
      }

      return imports;
    } catch (error) {
      console.error(`Error extracting imports from ${filePath}:`, error);
      return [];
    }
  }

  private async getTestCoverage(filePath: string): Promise<number | undefined> {
    // This is a placeholder - implement actual test coverage analysis
    // You might want to integrate with Jest or other testing frameworks
    return undefined;
  }

  private getDaysSinceModified(modifiedDate: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - modifiedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async runESLint(rootDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(
        'npx eslint --fix --ext .ts,.tsx,.js,.jsx src/',
        { cwd: rootDir },
        (error, stdout, stderr) => {
          if (error && error.code !== 1) {
            console.error('ESLint error:', stderr);
            reject(error);
          } else {
            console.log('ESLint output:', stdout);
            resolve();
          }
        }
      );
    });
  }

  private async checkDependencies(rootDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec('npx depcheck', { cwd: rootDir }, (error, stdout, stderr) => {
        if (error && error.code !== 1) {
          console.error('Depcheck error:', stderr);
          reject(error);
        } else {
          console.log('Depcheck output:', stdout);
          resolve();
        }
      });
    });
  }
}

// Export the analyzer
export const directoryAnalyzer = new DirectoryAnalyzer();
