import DirectoryOptimizer from './directory-optimizer.js';

async function main() {
  const rootDir = process.cwd();
  console.log('Starting project optimization...');
  console.log(`Root directory: ${rootDir}`);

  try {
    const optimizer = new DirectoryOptimizer(rootDir);
    await optimizer.optimize();
    console.log('Project optimization completed successfully!');
  } catch (error) {
    console.error('Error during project optimization:', error);
    process.exit(1);
  }
}

main();
