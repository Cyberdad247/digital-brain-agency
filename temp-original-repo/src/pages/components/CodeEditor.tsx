import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TriangleAlert, Play, LayoutTemplate } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Template {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

interface Diagnostic {
  severity: number;
  message: string;
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}

interface CodeEditorProps {
  onCodeChange: (code: string) => void;
  onRunCode: (code: string) => Promise<void>;
  diagnostics: Diagnostic[];
  addTerminalOutput: (output: (string | {message: string})[]) => void;
}

const TEMPLATES: Template[] = [
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Python scripts for analyzing datasets and creating visualizations',
    code: `import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv('data.csv')

# Basic analysis
print(df.describe())

# Create visualization
df.plot(kind='bar', x='category', y='value')
plt.show()`,
    language: 'python'
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Front-end and back-end component templates',
    code: `// React component template
function MyComponent() {
  const [state, setState] = useState();

  return (
    <div>
      <h1>My Component</h1>
    </div>
  );
}`,
    language: 'typescript'
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    description: 'Script mechanics and features for game engines',
    code: `// Unity C# script template
using UnityEngine;

public class PlayerController : MonoBehaviour {
    public float speed = 5.0f;

    void Update() {
        float move = Input.GetAxis("Vertical") * speed * Time.deltaTime;
        transform.Translate(0, 0, move);
    }
}`,
    language: 'csharp'
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    description: 'API call templates for various services',
    code: `// Fetch API template
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    language: 'typescript'
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Scripts for automating repetitive tasks',
    code: `// File processing automation
const fs = require('fs');
const path = require('path');

function processFiles(directory) {
  fs.readdir(directory, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(directory, file);
      // Process each file
    });
  });
}`,
    language: 'javascript'
  },
  {
    id: 'simulations',
    title: 'Mathematical Simulations',
    description: 'Algorithms for simulations and modeling',
    code: `// Monte Carlo simulation
function monteCarlo(iterations) {
  let inside = 0;
  
  for (let i = 0; i < iterations; i++) {
    const x = Math.random();
    const y = Math.random();
    
    if (x*x + y*y <= 1) {
      inside++;
    }
  }
  
  return 4 * inside / iterations;
}`,
    language: 'javascript'
  }
];

export default function CodeEditor({
  onCodeChange,
  onRunCode,
  diagnostics,
  addTerminalOutput
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState(`function hello() {\n  console.log('Hello world!');\n}`);
  const [showTemplates, setShowTemplates] = useState(true);

  const configureEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Configure TypeScript/JavaScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      jsx: monaco.languages.typescript.JsxEmit.React,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    });

    // Configure HTML
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
        extraLiners: 'head,body,/html'
      },
      suggest: {
        html5: true
      }
    });

    // Configure CSS
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
        idSelector: 'ignore'
      }
    });

    // Configure SQL
    monaco.languages.register({
      id: 'sql',
      extensions: ['.sql'],
      aliases: ['SQL', 'sql']
    });

    // Configure PowerShell
    monaco.languages.register({
      id: 'powershell',
      extensions: ['.ps1'],
      aliases: ['PowerShell', 'powershell', 'ps']
    });

    // Add type definitions and completions for common libraries
    const addTypeDefinitions = async (editor: monaco.editor.IStandaloneCodeEditor) => {
      try {
        // Add React types
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module 'react' {
            export = React;
            export as namespace React;
          }`,
          'node_modules/@types/react/index.d.ts'
        );

        // Add Node.js types
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module 'node' {
            export = NodeJS;
            export as namespace NodeJS;
          }`,
          'node_modules/@types/node/index.d.ts'
        );

        // Add custom completions
        monaco.languages.registerCompletionItemProvider('typescript', {
          provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };

            return {
              suggestions: [
                {
                  label: 'log',
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: 'console.log(${1:value})',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: 'Console log statement',
                  range: range
                },
                {
                  label: 'fetch',
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: 'fetch(\'${1:url}\')',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: 'Fetch API call',
                  range: range
                },
                {
                  label: 'useState',
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: 'React useState hook',
                  range: range
                }
              ]
            } as monaco.languages.CompletionList;
          }
        });

        // Enable semantic highlighting
        monaco.languages.registerDocumentSemanticTokensProvider('typescript', {
          getLegend: () => ({
            tokenTypes: ['variable', 'function', 'class', 'interface'],
            tokenModifiers: []
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
              resultId: null
            };
          },
          releaseDocumentSemanticTokens: () => {}
        });
      } catch (error) {
        console.error('Error configuring editor:', error);
      }
    };

    addTypeDefinitions(editor);
  };

  return (
    <motion.div
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg flex"
      whileHover={{ scale: 1.01 }}
    >
      {showTemplates && (
        <div className="w-1/4 border-r p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
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
                {TEMPLATES.filter(t => t.id === 'data-analysis').map(template => (
                  <Card 
                    key={template.id}
                    className="mb-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      setCode(template.code);
                      onCodeChange(template.code);
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
                {TEMPLATES.filter(t => t.id !== 'data-analysis').map(template => (
                  <Card 
                    key={template.id}
                    className="mb-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      setCode(template.code);
                      onCodeChange(template.code);
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
          theme="vs-dark"
          defaultLanguage="typescript"
          defaultValue={code}
          onChange={(value) => {
            setCode(value || '');
            onCodeChange(value || '');
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
            wordWrap: 'on'
          }}
        />
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <div>
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <LayoutTemplate className="mr-2 h-4 w-4" />
            {showTemplates ? 'Hide' : 'Show'} Templates
          </Button>
          <Button 
            className="mr-2"
            onClick={async () => {
              addTerminalOutput(['$ Running code...', 'Executing script...']);
              try {
                await onRunCode(code);
                addTerminalOutput(['Execution complete!']);
              } catch (error) {
                addTerminalOutput(['Error during execution:', error.message]);
              }
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Code
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
