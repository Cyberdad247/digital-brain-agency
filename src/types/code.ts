import type * as monaco from 'monaco-editor';

export interface CodeAnalysisResult {
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column?: number;
  }>;
  metrics: {
    complexity: number;
    maintainability: number;
    testability: number;
  };
}

export interface TestResult {
  passed: boolean;
  failureMessage?: string;
  testName: string;
  duration: number;
}

export interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
}

export type Templates = Record<string, CodeTemplate>;

export interface TokenizationResult {
  tokens: monaco.editor.IToken[];
  lineNumber: number;
}

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
  diagnostics?: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
  }>;
}