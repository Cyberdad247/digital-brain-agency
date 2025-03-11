import { securityProfiles } from '../config/security.config';
import { SecurityAnalyzer } from '../src/lib/security/SecurityAnalyzer';
import { directoryAnalyzer } from './directory-analyzer';
import path from 'path';
import { SecurityAnalysisResult } from '../types/security';

import fs from 'fs/promises';
import process from 'process';

export async function runSecurityAnalysis() {
  console.log('Starting security analysis...');

  try {
    const rootDir = process.cwd();
    const envName = process.env.NODE_ENV || 'production';
    const securityConfig = securityProfiles[envName as keyof typeof securityProfiles];
    const analyzer = new SecurityAnalyzer(securityConfig);

    // Run the analysis
    const result = await analyzer.analyze(rootDir);

    // Display results
    console.log('\nChecking for vulnerable dependencies...');
    try {
      await directoryAnalyzer.checkDependencies(rootDir);
    } catch (error) {
      console.error('Error checking dependencies:', error);
    }
    console.log('\nSecurity Analysis Report:');
    console.log('=======================');
    console.log(`Total Files Analyzed: ${result.metrics.totalFiles}`);
    console.log(`Files with Issues: ${result.metrics.filesWithIssues}`);
    console.log(`Average Complexity: ${result.metrics.averageComplexity.toFixed(2)}`);
    console.log(`Test Coverage: ${result.metrics.testCoverage}%`);

    // Display security issues
    if (result.securityIssues.length > 0) {
      console.log('\nSecurity Issues:');
      result.securityIssues.forEach((issue) => {
        console.log(`\n[${issue.severity.toUpperCase()}] ${issue.issueType}`);
        console.log(`File: ${path.relative(rootDir, issue.filePath)}`);
        console.log(`Description: ${issue.description}`);
      });
    }

    // Display recommendations
    if (result.recommendations.length > 0) {
      console.log('\nRecommendations:');
      result.recommendations.forEach((rec) => {
        console.log(`\n[${rec.priority.toUpperCase()}] ${rec.category}`);
        console.log(`Description: ${rec.description}`);
        if (rec.suggestedFix) {
          console.log(`Suggested Fix: ${rec.suggestedFix}`);
        }
      });
    }

    // Save report to file
    const reportPath = path.join(rootDir, 'security-report.json');
    await fs.writeFile(reportPath, JSON.stringify(result, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);
  } catch (error) {
    console.error('Error during security analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
runSecurityAnalysis();
