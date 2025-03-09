import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  theme?: 'light' | 'dark';
  onCodeChange?: (code: string) => void;
  onRunCode?: (code: string) => Promise<void>;
  diagnostics?: Array<{
    startLineNumber: number;
    message: string;
  }>;
  addTerminalOutput?: (lines: string[]) => void;
}

interface CodeAnalysisResult {
  type: string;
  message: string;
  line?: number;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}
import { CompilerService } from '@/lib/compiler/CompilerService';
import {
  TriangleAlert,
  Play,
  LayoutTemplate,
  FileSearch,
  TestTube2,
  Rocket,
  FileText,
  Sparkles,
  GitCommit,
  GitBranch,
  GitPullRequest,
  GitMerge,
  History,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { ErrorBoundary } from 'react-error-boundary';
import { memo, useMemo, useCallback } from 'react';

const MemoizedEditor = memo(Editor);
const MemoizedCard = memo(Card);

import type { CodeAnalysisResult, TestResult, CodeTemplate, Templates } from '../types/code';
import type * as monaco from 'monaco-editor';

const TEMPLATES: Templates = {
  'react-component': {
    id: 'react-component',
    title: 'React Component',
    description: 'Basic React functional component',
    language: 'typescript',
    code: "import React from 'react';\n\ninterface Props {\n  // Add props here\n}\n\nexport const Component: React.FC<Props> = () => {\n  return <div>Component</div>;\n};\n"
  },
  'node-express': {
    id: 'node-express',
    title: 'Express Server',
    description: 'Basic Express.js server setup',
    language: 'typescript',
    code: "import express from 'express';\n\nconst app = express();\nconst port = process.env.PORT || 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(`Server running on port ${port}`);\n});\n"
  }
};

export default function CodeEditor({
  theme,
  onCodeChange,
  onRunCode,
  diagnostics = [],
  addTerminalOutput = () => {},
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState(`function hello() {\n  console.log('Hello world!');\n}`);
  const [showTemplates, setShowTemplates] = useState(true);
  const [codeReviews, setCodeReviews] = useState<CodeAnalysisResult[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showVersionControl, setShowVersionControl] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [gitStatus, setGitStatus] = useState({
    branch: 'main',
    changes: 0,
    ahead: 0,
    behind: 0,
    conflicts: 0,
  });

  /**
   * Configures the Monaco editor with language settings and type definitions
   * @param editor - The Monaco editor instance to configure
   */
  const configureEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
    configureLanguageSettings();
    configureTypeDefinitions(editor);
  };

  /**
   * Sets up language-specific configurations for Monaco editor
   */
  const configureLanguageSettings = () => {
    // TypeScript configuration
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      typeRoots: ['node_modules/@types'],
      jsx: monaco.languages.typescript.JsxEmit.React,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    });

    // HTML configuration
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        wrapAttributes: 'force-expand-multiline',
        unformatted: 'code,pre,script',
        contentUnformatted: 'pre,code',
        indentInnerHtml: true,
        wrapLineLength: 120,
        endWithNewline: true,
        tabSize: 2,
        insertSpaces: true,
        preserveNewLines: true,
        maxPreserveNewLines: 2,
        indentHandlebars: false,
        extraLiners: 'head,body,/html',
      },
      suggest: {
        html5: true,
      },
    });

    // CSS configuration
    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'ignore',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore',
      },
    });

    // Register additional languages
    registerLanguages();
  };

  /**
   * Registers additional languages with Monaco editor
   */
  const registerLanguages = () => {
    monaco.languages.register({
      id: 'sql',
      extensions: ['.sql'],
      aliases: ['SQL', 'sql'],
    });

    monaco.languages.register({
      id: 'powershell',
      extensions: ['.ps1'],
      aliases: ['PowerShell', 'powershell', 'ps'],
    });
  };

  /**
   * Configures type definitions and language features
   * @param editor - The Monaco editor instance
   */
  const configureTypeDefinitions = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    try {
      await addStandardTypeDefinitions();
      await configureCompletionProviders();
      configureSemanticTokens();
    } catch (error) {
      console.error('Error configuring type definitions:', error);
    }
  };

  /**
   * Adds standard type definitions to the editor
   */
  const addStandardTypeDefinitions = async () => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' {
        export = React;
        export as namespace React;
      }`,
      'node_modules/@types/react/index.d.ts'
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'node' {
        export = NodeJS;
        export as namespace NodeJS;
      }`,
      'node_modules/@types/node/index.d.ts'
    );
  };

  /**
   * Configures code completion providers
   */
  const configureCompletionProviders = async () => {
    // AI-powered completion provider
    monaco.languages.registerCompletionItemProvider('typescript', {
      triggerCharacters: ['.', ' ', '('],
      provideCompletionItems: async (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        try {
          const response = await fetch('/api/llm/completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: textUntilPosition,
              language: model.getLanguageId(),
              position: {
                line: position.lineNumber,
                column: position.column,
              },
            }),
          });

          if (!response.ok) throw new Error('AI completion failed');
          const { suggestions } = await response.json();

          interface Suggestion {
            label: string;
            kind: string;
            insertText: string;
            isSnippet?: boolean;
            detail?: string;
            documentation?: string;
            prefixLength?: number;
          }

          return {
            suggestions: suggestions.map((s: Suggestion) => ({
              label: s.label,
              kind:
                monaco.languages.CompletionItemKind[s.kind] ||
                monaco.languages.CompletionItemKind.Text,
              insertText: s.insertText,
              insertTextRules: s.isSnippet
                ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                : undefined,
              detail: s.detail,
              documentation: s.documentation,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - (s.prefixLength || 0),
                endColumn: position.column,
              },
            })),
          };
        } catch (error) {
          console.error('AI completion error:', error);
          return { suggestions: [] };
        }
      },
    });

    // Basic completion provider
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: [
            {
              label: 'log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log(${1:value})',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Console log statement',
              range: range,
            },
            {
              label: 'fetch',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "fetch('${1:url}')",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Fetch API call',
              range: range,
            },
            {
              label: 'useState',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText:
                'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'React useState hook',
              range: range,
            },
          ],
        } as monaco.languages.CompletionList;
      },
    });
  };

  /**
   * Configures semantic token highlighting
   */
  const configureSemanticTokens = () => {
    monaco.languages.registerDocumentSemanticTokensProvider('typescript', {
      getLegend: () => ({
        tokenTypes: ['variable', 'function', 'class', 'interface'],
        tokenModifiers: [],
      }),
      provideDocumentSemanticTokens: (model) => {
        const tokens = [];
        const lines = model.getLinesContent();

        lines.forEach((line, lineNumber) => {
          const words = line.split(/\W+/);
          words.forEach((word) => {
            if (word.match(/^[A-Z]/)) {
              tokens.push(lineNumber + 1, word.length, 2, 0);
            } else if (word.match(/^[a-z]/)) {
              tokens.push(lineNumber + 1, word.length, 1, 0);
            }
          });
        });

        return {
          data: new Uint32Array(tokens),
          resultId: null,
        };
      },
      releaseDocumentSemanticTokens: () => {},
    });
  };

  const handleRunCode = useCallback(async () => {
    addTerminalOutput(['$ Running code...', 'Compiling and executing script...']);
    try {
      const compiler = CompilerService.getInstance();
      const result = await compiler.compileTypeScript(code);

      if (!result.success) {
        const errors = compiler.formatDiagnostics(result.diagnostics);
        addTerminalOutput(['Compilation failed:', ...errors]);
        return;
      }

      await onRunCode?.(result.outputText);
      addTerminalOutput(['Compilation and execution complete!']);
    } catch (error) {
      addTerminalOutput([
        'Error during compilation/execution:',
        error instanceof Error ? error.message : 'Unknown error',
      ]);
    }
  }, [code, onRunCode, addTerminalOutput]);

  const handleCodeReview = useCallback(async () => {
    if (isReviewing) return;

    setIsReviewing(true);
    addTerminalOutput(['$ Analyzing code...']);

    try {
      const response = await fetch('/api/llm/code-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: editorRef.current?.getModel()?.getLanguageId(),
        }),
      });

      if (!response.ok) throw new Error('Code review request failed');

      const { reviews } = await response.json();
      setCodeReviews(reviews);
      addTerminalOutput(['Code review complete! Found ' + reviews.length + ' issues']);
    } catch (error) {
      setCodeReviews([]);
      addTerminalOutput([
        'Error during code review:',
        error instanceof Error ? error.message : 'Unknown error',
      ]);
    } finally {
      setIsReviewing(false);
    }
  }, [code, isReviewing, addTerminalOutput]);

  const renderDiagnostics = useMemo(() => {
    if (diagnostics.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Alert variant="destructive" className="mt-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div>
              {diagnostics.length} issue{diagnostics.length > 1 ? 's' : ''} found
            </div>
            <div className="space-y-1">
              {diagnostics.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm">Line {d.startLineNumber}:</span>
                  <span className="text-sm">{d.message}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }, [diagnostics]);

  return (
    <motion.div
      className="flex h-[700px] w-full rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      whileHover={{ scale: 1.01 }}
    >
      {showTemplates && (
        <div className="w-1/4 border-r p-4">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            <LayoutTemplate className="mr-2 h-5 w-5" />
            Code Templates
          </h2>
          <ScrollArea className="h-[550px]">
            <Tabs defaultValue="data-analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data-analysis">Analysis</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>

              <TabsContent value="data-analysis">
                {TEMPLATES.filter((t) => t.id === 'data-analysis').map((template) => (
                  <Card
                    key={template.id}
                    className="mb-4 cursor-pointer transition-colors hover:bg-accent/50"
                    onClick={() => {
                      setCode(template.code);
                      onCodeChange?.(template.code);
                      if (editorRef.current) {
                        editorRef.current.setValue(template.code);
                        monaco.editor.setModelLanguage(
                          editorRef.current.getModel()!,
                          template.language
                        );
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="development">
                {TEMPLATES.filter((t) => t.id !== 'data-analysis').map((template) => (
                  <Card
                    key={template.id}
                    className="mb-4 cursor-pointer transition-colors hover:bg-accent/50"
                    onClick={() => {
                      setCode(template.code);
                      onCodeChange?.(template.code);
                      if (editorRef.current) {
                        editorRef.current.setValue(template.code);
                        monaco.editor.setModelLanguage(
                          editorRef.current.getModel()!,
                          template.language
                        );
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      )}

      <div className={`h-[600px] ${showTemplates ? 'w-3/4' : 'w-full'}`}>
        <Editor
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          defaultLanguage="typescript"
          defaultValue={code}
          onChange={(value) => {
            setCode(value || '');
            onCodeChange?.(value || '');
          }}
          onMount={(editor) => {
            editorRef.current = editor;
            configureEditor(editor);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            quickSuggestions: { other: 'on' },
            parameterHints: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            codeLens: true,
            cursorBlinking: 'smooth',
            folding: true,
            lightbulb: { enabled: monaco.editor.ShowLightbulbIconMode.On },
            matchBrackets: 'always',
            wordWrap: 'on',
          }}
        />
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <div>
          <Button variant="ghost" className="mr-2" onClick={() => setShowTemplates(!showTemplates)}>
            <LayoutTemplate className="mr-2 h-4 w-4" />
            {showTemplates ? 'Hide' : 'Show'} Templates
          </Button>
          <Button
            className="mr-2"
            onClick={async () => {
              addTerminalOutput(['$ Running code...', 'Executing script...']);
              try {
                await onRunCode?.(code);
                addTerminalOutput(['Execution complete!']);
              } catch (error) {
                addTerminalOutput(['Error during execution:', error.message]);
              }
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Code
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={async () => {
              setIsReviewing(true);
              addTerminalOutput(['$ Analyzing code...']);
              try {
                const response = await fetch('/api/llm/code-review', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                  }),
                });

                if (!response.ok) throw new Error('Code review failed');
                const { reviews } = await response.json();
                setCodeReviews(reviews);
                addTerminalOutput(['Code review complete! Found ' + reviews.length + ' issues']);
              } catch (error) {
                addTerminalOutput(['Error during code review:', error.message]);
              } finally {
                setIsReviewing(false);
              }
            }}
            disabled={isReviewing}
          >
            {isReviewing ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Reviewing...
              </div>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Review Code
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={async () => {
              addTerminalOutput(['$ Running tests...']);
              try {
                const response = await fetch('/api/run-tests', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                  }),
                });

                if (!response.ok) throw new Error('Test execution failed');
                const { results } = await response.json();
                addTerminalOutput([
                  'Test execution complete!',
                  ...results.map(
                    (r: TestResult) => `${r.passed ? '✅' : '❌'} ${r.testName}: ${r.message}`
                  ),
                ]);
              } catch (error: unknown) {
                if (error instanceof Error) {
                  addTerminalOutput(['Error during test execution:', error.message]);
                } else {
                  addTerminalOutput(['Error during test execution:', String(error)]);
                }
              }
            }}
          >
            <TestTube2 className="mr-2 h-4 w-4" />
            Run Tests
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={async () => {
              addTerminalOutput(['$ Generating documentation...']);
              try {
                const response = await fetch('/api/generate-docs', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                    format: 'markdown',
                  }),
                });

                if (!response.ok) throw new Error('Documentation generation failed');
                const { documentation } = await response.json();
                addTerminalOutput([
                  'Documentation generated successfully!',
                  'Documentation preview:',
                  documentation,
                ]);
              } catch (error) {
                addTerminalOutput(['Error during documentation generation:', error.message]);
              }
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Docs
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={async () => {
              setIsOptimizing(true);
              addTerminalOutput(['$ Optimizing code...']);
              try {
                const response = await fetch('/api/optimize-code', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                    metrics: ['performance', 'memory', 'readability'],
                  }),
                });

                if (!response.ok) throw new Error('Code optimization failed');
                const { optimizedCode, metrics } = await response.json();

                // Update editor with optimized code
                setCode(optimizedCode);
                if (editorRef.current) {
                  editorRef.current.setValue(optimizedCode);
                }

                addTerminalOutput([
                  'Code optimization complete!',
                  'Optimization metrics:',
                  `• Performance improvement: ${metrics.performance}%`,
                  `• Memory usage reduction: ${metrics.memory}%`,
                  `• Readability score: ${metrics.readability}/10`,
                  'Optimized code has been applied to the editor',
                ]);
              } catch (error) {
                addTerminalOutput(['Error during code optimization:', error.message]);
              } finally {
                setIsOptimizing(false);
              }
            }}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Optimizing...
              </div>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Optimize Code
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => setShowVersionControl(!showVersionControl)}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            {showVersionControl ? 'Hide' : 'Show'} Version Control
          </Button>
          {showVersionControl && (
            <div className="absolute bottom-16 right-4 z-50 w-96 rounded-lg border bg-background p-4 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4" />
                    <span>Branch: {gitStatus.branch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {gitStatus.changes} changes
                    </span>
                    {gitStatus.ahead > 0 && (
                      <span className="text-sm text-green-500">↑{gitStatus.ahead}</span>
                    )}
                    {gitStatus.behind > 0 && (
                      <span className="text-sm text-red-500">↓{gitStatus.behind}</span>
                    )}
                    {gitStatus.conflicts > 0 && (
                      <span className="text-sm text-yellow-500">⚠{gitStatus.conflicts}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        addTerminalOutput(['$ Committing changes...']);
                        try {
                          const response = await fetch('/api/git/commit', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              message: commitMessage,
                              files: [
                                {
                                  path: 'src/components/CodeEditor.tsx',
                                  content: code,
                                },
                              ],
                            }),
                          });

                          if (!response.ok) throw new Error('Commit failed');
                          const { status } = await response.json();
                          setGitStatus(status);
                          addTerminalOutput(['Commit successful!']);
                          setCommitMessage('');
                        } catch (error) {
                          addTerminalOutput(['Error during commit:', error.message]);
                        }
                      }}
                    >
                      <GitCommit className="mr-2 h-4 w-4" />
                      Commit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        addTerminalOutput(['$ Pushing changes...']);
                        try {
                          const response = await fetch('/api/git/push', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              branch: gitStatus.branch,
                            }),
                          });

                          if (!response.ok) throw new Error('Push failed');
                          const { status } = await response.json();
                          setGitStatus(status);
                          addTerminalOutput(['Push successful!']);
                        } catch (error) {
                          addTerminalOutput(['Error during push:', error.message]);
                        }
                      }}
                    >
                      <GitMerge className="mr-2 h-4 w-4" />
                      Push
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        addTerminalOutput(['$ Pulling changes...']);
                        try {
                          const response = await fetch('/api/git/pull', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              branch: gitStatus.branch,
                            }),
                          });

                          if (!response.ok) throw new Error('Pull failed');
                          const { status, changes } = await response.json();
                          setGitStatus(status);
                          if (changes.conflicts > 0) {
                            addTerminalOutput([
                              'Pull successful with conflicts!',
                              'Resolve conflicts in the version history panel',
                            ]);
                          } else {
                            addTerminalOutput(['Pull successful!']);
                          }
                        } catch (error) {
                          addTerminalOutput(['Error during pull:', error.message]);
                        }
                      }}
                    >
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      Pull
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="mb-2 flex items-center text-sm font-medium">
                    <History className="mr-2 h-4 w-4" />
                    Version History
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={async () => {
                        addTerminalOutput(['$ Fetching version history...']);
                        try {
                          const response = await fetch('/api/git/history', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              file: 'src/components/CodeEditor.tsx',
                            }),
                          });

                          if (!response.ok) throw new Error('Failed to fetch history');
                          interface CommitHistory {
                            hash: string;
                            message: string;
                            author: string;
                            date: string;
                          }

                          const { history } = (await response.json()) as {
                            history: CommitHistory[];
                          };
                          addTerminalOutput([
                            'Version history:',
                            ...history.map((h) => `${h.hash.slice(0, 7)} - ${h.message}`),
                          ]);
                        } catch (error) {
                          addTerminalOutput(['Error fetching history:', error.message]);
                        }
                      }}
                    >
                      View History
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={async () => {
                        addTerminalOutput(['$ Fetching diff...']);
                        try {
                          const response = await fetch('/api/git/diff', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              file: 'src/components/CodeEditor.tsx',
                            }),
                          });

                          if (!response.ok) throw new Error('Failed to fetch diff');
                          interface FileDiff {
                            type: 'added' | 'modified' | 'deleted';
                            file: string;
                            changes: string[];
                          }

                          const { diff } = (await response.json()) as { diff: FileDiff[] };
                          addTerminalOutput([
                            'File changes:',
                            ...diff.map((d) => `${d.type} ${d.file}`),
                          ]);
                        } catch (error) {
                          addTerminalOutput(['Error fetching diff:', error.message]);
                        }
                      }}
                    >
                      View Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            className="mr-2"
            onClick={async () => {
              addTerminalOutput(['$ Analyzing code quality...']);
              try {
                const response = await fetch('/api/code-analysis', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                    analysisTypes: ['quality', 'performance', 'security'],
                  }),
                });

                if (!response.ok) throw new Error('Code analysis failed');
                const { results } = (await response.json()) as { results: CodeAnalysisResult[] };

                // Group results by category
                const groupedResults = results.reduce(
                  (acc, result) => {
                    acc[result.category] = acc[result.category] || [];
                    acc[result.category].push(result);
                    return acc;
                  },
                  {} as Record<string, CodeAnalysisResult[]>
                );

                addTerminalOutput([
                  'Code analysis complete!',
                  ...Object.entries(groupedResults).map(
                    ([category, issues]) =>
                      `${category} issues (${issues.length}):\n` +
                      issues
                        .map(
                          (issue) =>
                            `  ${issue.severity.toUpperCase()} - Line ${issue.startLineNumber}: ${issue.message}` +
                            (issue.metrics
                              ? `\n    Metrics: ${JSON.stringify(issue.metrics)}`
                              : '') +
                            (issue.suggestedFix
                              ? `\n    Suggested Fix: ${issue.suggestedFix.description}`
                              : '')
                        )
                        .join('\n')
                  ),
                ]);

                // Update diagnostics with analysis results
                setCodeReviews(results);
              } catch (error) {
                addTerminalOutput(['Error during code analysis:', error.message]);
              }
            }}
          >
            <TestTube2 className="mr-2 h-4 w-4" />
            Analyze Code
          </Button>

          <Button
            variant="secondary"
            onClick={async () => {
              addTerminalOutput(['$ Deploying code...']);
              try {
                const response = await fetch('/api/deploy', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code,
                    language: editorRef.current?.getModel()?.getLanguageId(),
                  }),
                });

                if (!response.ok) throw new Error('Deployment failed');
                const { url } = await response.json();
                addTerminalOutput(['Deployment successful!', `Access your application at: ${url}`]);
              } catch (error) {
                addTerminalOutput(['Error during deployment:', error.message]);
              }
            }}
          >
            <Rocket className="mr-2 h-4 w-4" />
            Deploy
          </Button>
        </div>
        {diagnostics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <div>
                  {diagnostics.length} issue{diagnostics.length > 1 ? 's' : ''} found
                </div>
                <div className="space-y-1">
                  {diagnostics.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">Line {d.startLineNumber}:</span>
                      <span className="text-sm">{d.message}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
