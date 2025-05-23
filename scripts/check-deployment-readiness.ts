import fs from 'fs';
import path from 'path';

function checkDeploymentReadiness() {
  console.log('Checking deployment readiness...');
  
  // Check if build output exists
  const outputDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(outputDir)) {
    console.error('Build output directory does not exist!');
    process.exit(1);
  }
  
  // Check if required environment variables are set
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SENTRY_DSN',
    'NEXT_PUBLIC_ENVIRONMENT'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.warn(`Warning: Missing recommended environment variables: ${missingEnvVars.join(', ')}`);
    console.warn('These variables should be set in Vercel project settings');
  } else {
    console.log('✅ All required environment variables are present');
  }
  
  // Check for sensitive information in .env.local
  if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    const envLocalContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    if (envLocalContent.includes('GEMINI_KEY=')) {
      console.warn('⚠️ Warning: GEMINI_KEY found in .env.local. Consider moving this to Vercel secrets.');
    }
  }
  
  // Check vercel.json configuration
  if (fs.existsSync(path.join(process.cwd(), 'vercel.json'))) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'));
      
      // Check output directory
      if (vercelConfig.outputDirectory !== '.next') {
        console.error('❌ vercel.json outputDirectory is not set to ".next"');
        process.exit(1);
      } else {
        console.log('✅ vercel.json outputDirectory is correctly set to ".next"');
      }
      
      // Check build configuration
      if (vercelConfig.builds && vercelConfig.builds.some(build => 
        build.use === '@vercel/static-build' && build.config && build.config.distDir !== '.next')) {
        console.error('❌ vercel.json build config distDir is not set to ".next"');
        process.exit(1);
      } else {
        console.log('✅ vercel.json build config is correctly configured');
      }
    } catch (error) {
      console.error('❌ Error parsing vercel.json:', error);
      process.exit(1);
    }
  } else {
    console.warn('⚠️ vercel.json not found');
  }
  
  // Check next.config.js
  if (fs.existsSync(path.join(process.cwd(), 'next.config.js'))) {
    const nextConfigContent = fs.readFileSync(path.join(process.cwd(), 'next.config.js'), 'utf8');
    if (!nextConfigContent.includes('output: \'standalone\'')) {
      console.warn('⚠️ next.config.js does not have output: "standalone" set');
    } else {
      console.log('✅ next.config.js has output: "standalone" set');
    }
  } else {
    console.error('❌ next.config.js not found');
    process.exit(1);
  }
  
  console.log('Deployment readiness check completed!');
}

checkDeploymentReadiness();