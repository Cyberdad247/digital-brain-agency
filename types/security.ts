export interface SecurityConfig {
  securityPatterns: {
    sensitiveFiles: RegExp;
    configFiles: RegExp;
    tempFiles: RegExp;
    logFiles: RegExp;
  };

  thresholds: {
    maxFileSize: number; // Maximum file size in bytes
    maxComplexity: number; // Maximum cyclomatic complexity
    maxDependencies: number; // Maximum number of dependencies per file
    minTestCoverage: number; // Minimum test coverage percentage
  };

  excludedDirs: string[];

  rules: {
    enforceHttps: boolean;
    requireAuthentication: boolean;
    validateInputs: boolean;
    preventXss: boolean;
    checkDependencies: boolean;
    enforceCSP: boolean;
  };

  scanOptions: {
    checkForSecrets: boolean;
    analyzeDependencies: boolean;
    validateConfigs: boolean;
    checkPermissions: boolean;
  };
}

export interface SecurityAnalysisResult {
  securityIssues: Array<{
    filePath: string;
    issueType: 'sensitive' | 'config' | 'temp' | 'log' | 'dependency' | 'permissions';
    severity: 'low' | 'medium' | 'high';
    description: string;
    remediationScript?: string;
  }>;

  metrics: {
    totalFiles: number;
    filesWithIssues: number;
    averageComplexity: number;
    testCoverage: number;
    deploymentTime?: number;
    memoryUsage?: number;
    envValidationPassed?: boolean;
  };

  recommendations: Array<{
    category: 'security' | 'performance' | 'maintenance';
    priority: 'low' | 'medium' | 'high';
    description: string;
    suggestedFix?: string;
    remediationScript?: string;
  }>;
}
