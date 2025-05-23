import { directoryAnalyzer } from './directory-analyzer';
import { LLMOrchestrator } from '../src/lib/llm/orchestrator';
import { SecurityAnalyzer } from '../src/lib/security/SecurityAnalyzer';
import { securityProfiles } from '../config/security.config';
import { ConfigValidator } from '../src/lib/config/ConfigValidator';
import { BundleAnalyzer } from '../src/lib/performance/BundleAnalyzer';

interface OptimizationConfig {
  rootDir: string;
  enableLLM: boolean;
  securityCheck: boolean;
  bundleAnalysis: boolean;
  configCheck: boolean;
}

// Add structured error handling
interface AnalysisError {
  module: string;
  errorType: 'IO' | 'PROCESSING' | 'SECURITY';
  recoveryStrategy: string;
}

async function runAnalysis() {
  try {
    // Run directory analysis
    const report = await directoryAnalyzer.analyzeDirectory(config.rootDir);

    console.log('\nAnalysis Report:');
    console.log('==============');
    console.log(`Unused Files: ${report.unusedFiles.length}`);
    console.log(`Low Coverage Files: ${report.lowCoverageFiles.length}`);
    console.log(`Large Files: ${report.largeFiles.length}`);
    console.log(`Duplicate Files: ${report.duplicateFiles.length}`);

    if (config.enableLLM) {
      const llm = new LLMOrchestrator();

      // Process suggestions with LLM
      for (const suggestion of report.suggestions) {
        try {
          const improvement = await llm.generateCode(
            `Analyze and suggest improvements for: ${suggestion}`
          );
          console.log('\nLLM Suggestion:', improvement);
        } catch (error) {
          console.error('Error getting LLM suggestion:', error);
        }
      }
    }

    if (config.securityCheck) {
      console.log('\nRunning security checks...');
      const envName = process.env.NODE_ENV || 'production';
      const securityConfig = securityProfiles[envName as keyof typeof securityProfiles];
      const securityAnalyzer = new SecurityAnalyzer(securityConfig);
      await securityAnalyzer.analyze(config.rootDir);
    }

    // Configuration validation
    if (config.configCheck) {
      console.log('\nValidating configurations...');
      const configValidator = new ConfigValidator();
      const configResults = await configValidator.auditConfigs();
      
      console.log('\nConfiguration Validation Results:');
      console.log('- Configuration issues found:', configResults.length);
      
      // Add configIssues property to report if needed
      if (!('configIssues' in report)) {
        (report as any).configIssues = configResults;
      }
    }

    if (config.bundleAnalysis) {
      console.log('\nAnalyzing bundle size...');
      const bundleAnalyzer = new BundleAnalyzer();
      const bundleReport = await bundleAnalyzer.analyze({
        // This works with either Vite or Webpack
        bundler: (process.env.BUNDLER as 'vite' | 'webpack') || 'vite',
        outputDir: './dist',
        statsFile: './stats.json'
      });
      
      console.log('\nBundle Analysis Results:');
      console.log(`- Total Bundle Size: ${bundleReport.totalSize} KB`);
      console.log(`- Largest Dependencies: ${bundleReport.largestDeps.map(d => `${d.name} (${d.size} KB)`).join(', ')}`);
      console.log(`- Duplicate Packages: ${bundleReport.duplicates.length}`);
      
      // Add bundleIssues property to report if needed
      (report as any).bundleIssues = bundleReport.issues;
    }

    console.log('\nAnalysis complete! Check the report above for details.');
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const config: OptimizationConfig = {
  rootDir: process.cwd(),
  enableLLM: args.includes('--enableLLM'),
  securityCheck: args.includes('--securityCheck'),
  bundleAnalysis: args.includes('--bundleAnalysis'),
  configCheck: args.includes('--configCheck')
};

// If no specific flags are provided, enable all checks
if (!args.some(arg => arg.startsWith('--'))) {
  config.enableLLM = true;
  config.securityCheck = true;
  config.bundleAnalysis = true;
  config.configCheck = true;
}

// Run the analysis with the configured options
runAnalysis(config);
