/**
 * Represents an individual issue found during code analysis
 */
export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column?: number;
  severity: number;
  source?: string;
  fix?: {
    description: string;
    changes: Array<{
      start: { line: number; column: number };
      end: { line: number; column: number };
      replacement: string;
    }>;
  };
}

/**
 * Represents code quality metrics and statistics
 */
export interface CodeMetrics {
  complexity: number;
  maintainability: number;
  linesOfCode: number;
  commentLines: number;
  duplicateLines?: number;
  coverage?: number;
  dependencies?: Array<{
    name: string;
    version: string;
    type: 'direct' | 'dev' | 'peer';
  }>;
}

/**
 * Represents the complete result of code analysis
 */
export interface CodeAnalysisResult {
  issues: CodeIssue[];
  metrics: CodeMetrics;
  timestamp: number;
  duration?: number;
}

/**
 * Represents the result of running tests
 */
export interface TestResult {
  passed: boolean;
  message: string;
  duration?: number;
  details?: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    coverage?: number;
  };
  failureDetails?: Array<{
    testName: string;
    error: string;
    stack?: string;
  }>;
}

/**
 * Props for the CodeEditor component
 */
export interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onCodeChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onFormat?: () => void;
  readOnly?: boolean;
  lineNumbers?: boolean;
  minimap?: boolean;
  fontSize?: number;
  tabSize?: number;
  diagnostics?: CodeIssue[];
  markers?: Array<{
    line: number;
    type: 'error' | 'warning' | 'info';
    message: string;
  }>;
}