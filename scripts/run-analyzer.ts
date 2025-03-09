import { directoryAnalyzer } from './directory-analyzer';
import { LLMOrchestrator } from '../src/lib/llm/orchestrator';

interface OptimizationConfig {
  rootDir: string;
  enableLLM: boolean;
  securityCheck: boolean;
  bundleAnalysis: boolean;
}

async function runAnalysis(config: OptimizationConfig) {
  console.log('Starting directory analysis...');

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
      // Add security scanning logic here
    }

    if (config.bundleAnalysis) {
      console.log('\nAnalyzing bundle size...');
      // Add bundle size analysis logic here
    }

    console.log('\nAnalysis complete! Check the report above for details.');
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

// Run the analysis with default configuration
runAnalysis({
  rootDir: process.cwd(),
  enableLLM: true,
  securityCheck: true,
  bundleAnalysis: true,
});
