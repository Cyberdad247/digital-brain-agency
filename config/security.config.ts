import { SecurityConfig } from '../types/security';

export const securityProfiles = {
  development: {
    scanDepth: 1,
    enableCICDChecks: false,
    strictMode: false,
    allowedFileTypes: ['.env', '.pem'],
    permissionChecks: false,
    dependencyScanning: {
      enabled: false,
      frequency: 'never'
    },
    securityPatterns: {
      sensitiveFiles: /\.(env|pem|key|cert)$/i,
      configFiles: /\.(json|yaml|yml|xml|ini|conf|config)$/i,
      tempFiles: /\.(tmp|temp|bak|old|swp)$/i,
      logFiles: /\.(log|logs)$/i
    },
    thresholds: {
      maxFileSize: 1000000,
      maxComplexity: 15,
      maxDependencies: 20,
      minTestCoverage: 60
    },
    excludedDirs: ['node_modules', '.git', 'dist', 'build'],
    rules: {
      enforceHttps: false,
      requireAuthentication: false,
      validateInputs: false,
      preventXss: false,
      checkDependencies: false,
      enforceCSP: false
    },
    scanOptions: {
      checkForSecrets: false,
      analyzeDependencies: false,
      validateConfigs: false,
      checkPermissions: false
    }
  } as SecurityConfig,
  
  staging: {
    scanDepth: 3,
    enableCICDChecks: true,
    strictMode: true,
    allowedFileTypes: [],
    permissionChecks: true,
    dependencyScanning: {
      enabled: true,
      frequency: 'weekly'
    },
    securityPatterns: {
      sensitiveFiles: /\.(env|pem|key|cert)$/i,
      configFiles: /\.(json|yaml|yml|xml|ini|conf|config)$/i,
      tempFiles: /\.(tmp|temp|bak|old|swp)$/i,
      logFiles: /\.(log|logs)$/i
    },
    thresholds: {
      maxFileSize: 500000,
      maxComplexity: 10,
      maxDependencies: 15,
      minTestCoverage: 75
    },
    excludedDirs: ['node_modules', '.git', 'dist', 'build'],
    rules: {
      enforceHttps: true,
      requireAuthentication: true,
      validateInputs: true,
      preventXss: true,
      checkDependencies: true,
      enforceCSP: true
    },
    scanOptions: {
      checkForSecrets: true,
      analyzeDependencies: true,
      validateConfigs: true,
      checkPermissions: true
    }
  } as SecurityConfig,

  production: {
    scanDepth: 5,
    enableCICDChecks: true,
    strictMode: true,
    allowedFileTypes: [],
    permissionChecks: true,
    dependencyScanning: {
      enabled: true,
      frequency: 'daily'
    },
    runtimeProtection: true,
    securityPatterns: {
      sensitiveFiles: /\.(env|pem|key|cert)$/i,
      configFiles: /\.(json|yaml|yml|xml|ini|conf|config)$/i,
      tempFiles: /\.(tmp|temp|bak|old|swp)$/i,
      logFiles: /\.(log|logs)$/i
    },
    thresholds: {
      maxFileSize: 250000,
      maxComplexity: 8,
      maxDependencies: 10,
      minTestCoverage: 90
    },
    excludedDirs: ['node_modules', '.git', 'dist', 'build'],
    rules: {
      enforceHttps: true,
      requireAuthentication: true,
      validateInputs: true,
      preventXss: true,
      checkDependencies: true,
      enforceCSP: true
    },
    scanOptions: {
      checkForSecrets: true,
      analyzeDependencies: true,
      validateConfigs: true,
      checkPermissions: true
    }
  } as SecurityConfig
};
