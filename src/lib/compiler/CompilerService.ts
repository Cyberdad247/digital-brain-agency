import * as ts from 'typescript';
import { ErrorBoundary } from 'react-error-boundary';

export interface CompilationResult {
  outputText: string;
  diagnostics: ts.Diagnostic[];
  success: boolean;
}

export interface CompilerOptions extends ts.CompilerOptions {
  sourceMap?: boolean;
  inlineSourceMap?: boolean;
  target?: ts.ScriptTarget;
}

export class CompilerService {
  private static instance: CompilerService;
  private compilerOptions: CompilerOptions;

  private constructor() {
    this.compilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      sourceMap: true,
      inlineSourceMap: true,
      jsx: ts.JsxEmit.React,
    };
  }

  public static getInstance(): CompilerService {
    if (!CompilerService.instance) {
      CompilerService.instance = new CompilerService();
    }
    return CompilerService.instance;
  }

  public async compileTypeScript(sourceCode: string): Promise<CompilationResult> {
    try {
      const fileName = 'input.ts';
      const program = ts.createProgram(
        [fileName],
        this.compilerOptions,
        ts.createCompilerHost(this.compilerOptions)
      );

      const sourceFile = ts.createSourceFile(
        fileName,
        sourceCode,
        this.compilerOptions.target || ts.ScriptTarget.ES2020,
        true
      );

      const diagnostics = ts.getPreEmitDiagnostics(program);
      const emitResult = program.emit();

      const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

      const success = allDiagnostics.length === 0;
      const outputText = ts.transpileModule(sourceCode, {
        compilerOptions: this.compilerOptions,
      }).outputText;

      return {
        outputText,
        diagnostics: allDiagnostics,
        success,
      };
    } catch (error) {
      console.error('Compilation error:', error);
      return {
        outputText: '',
        diagnostics: [],
        success: false,
      };
    }
  }

  public formatDiagnostics(diagnostics: ts.Diagnostic[]): string[] {
    return diagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        return `Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
      }
      return `Error: ${message}`;
    });
  }

  public setCompilerOptions(options: CompilerOptions): void {
    this.compilerOptions = { ...this.compilerOptions, ...options };
  }
}
