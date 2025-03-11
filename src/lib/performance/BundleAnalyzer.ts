import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface BundleAnalysisConfig {
  bundler: 'vite' | 'webpack';
  outputDir: string;
  statsFile: string;
}

// Add linting rules
interface BundleReport {
  totalSize: number;
  // Enforce strict null checks
  largestDeps!: Array<{ name: string; size: number }> | null;
}

// ESLint Recommendations
"rules": {
  "security/detect-object-injection": "error",
  "complexity": ["error", { "max": 5 }]
}

export class BundleAnalyzer {
  async analyze(config: BundleAnalysisConfig): Promise<BundleReport> {
    if (config.bundler === 'webpack') {
      return this.analyzeWebpack(config);
    } else {
      return this.analyzeVite(config);
    }
  }

  private async analyzeWebpack(config: BundleAnalysisConfig): Promise<BundleReport> {
    try {
      // Generate stats file if it doesn't exist
      if (!fs.existsSync(config.statsFile)) {
        await execAsync('npx webpack --profile --json > ' + config.statsFile);
      }

      const stats = JSON.parse(fs.readFileSync(config.statsFile, 'utf8'));
      
      // Extract bundle information
      const totalSize = this.calculateTotalSize(stats);
      const largestDeps = this.findLargestDependencies(stats);
      const duplicates = this.findDuplicatePackages(stats);
      
      return {
        totalSize,
        largestDeps,
        duplicates,
        issues: this.identifyIssues(stats)
      };
    } catch (error) {
      console.error('Error analyzing webpack bundle:', error);
      return this.getEmptyReport();
    }
  }

  private async analyzeVite(config: BundleAnalysisConfig): Promise<BundleReport> {
    try {
      // For Vite, we need to analyze the output directory
      const outputDir = path.resolve(config.outputDir);
      
      if (!fs.existsSync(outputDir)) {
        throw new Error(`Output directory ${outputDir} does not exist. Build the project first.`);
      }
      
      // Get all JS files in the output directory
      const files = this.getAllFiles(outputDir, ['.js']);
      const totalSize = this.calculateFilesSize(files);
      
      // For more detailed analysis, you might want to use rollup-plugin-visualizer
      // which works with Vite's underlying Rollup
      
      return {
        totalSize: Math.round(totalSize / 1024), // Convert to KB
        largestDeps: [], // Would need additional tools for detailed dep analysis
        duplicates: [],
        issues: [
          {
            type: 'info',
            message: 'For more detailed Vite bundle analysis, consider using rollup-plugin-visualizer',
            severity: 'info'
          }
        ]
      };
    } catch (error) {
      console.error('Error analyzing vite bundle:', error);
      return this.getEmptyReport();
    }
  }

  private getAllFiles(dir: string, extensions: string[]): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllFiles(filePath, extensions));
      } else {
        const ext = path.extname(file).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(filePath);
        }
      }
    });
    
    return results;
  }

  private calculateFilesSize(files: string[]): number {
    return files.reduce((total, file) => {
      const stats = fs.statSync(file);
      return total + stats.size;
    }, 0);
  }

  private calculateTotalSize(stats: any): number {
    // Implementation depends on webpack stats format
    return Math.round(stats.assets.reduce((total: number, asset: any) => total + asset.size, 0) / 1024);
  }

  private findLargestDependencies(stats: any): Array<{ name: string; size: number }> {
    // Implementation depends on webpack stats format
    // This is a simplified version
    return [];
  }

  private findDuplicatePackages(stats: any): Array<{ name: string; instances: number }> {
    // Implementation depends on webpack stats format
    return [];
  }

  private identifyIssues(stats: any): Array<{ type: string; message: string; severity: 'info' | 'warning' | 'error' }> {
    const issues: Array<{ type: string; message: string; severity: 'info' | 'warning' | 'error' }> = [];
    
    // Check for large bundle size
    if (stats.assets.some((asset: any) => asset.size > 1000000)) {
      issues.push({
        type: 'large-bundle',
        message: 'Some bundles exceed 1MB in size, consider code splitting',
        severity: 'warning'
      });
    }
    
    return issues;
  }

  private getEmptyReport(): BundleReport {
    return {
      totalSize: 0,
      largestDeps: [],
      duplicates: [],
      issues: [{
        type: 'error',
        message: 'Failed to analyze bundle',
        severity: 'error'
      }]
    };
  }
}