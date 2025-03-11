import { AppError, ErrorCategory, ErrorSeverity } from './AppError';
import { ErrorMonitoringService } from './ErrorMonitoringService';
import { LoggingService } from './LoggingService';

/**
 * InspiraErrorHandler
 * 
 * A specialized error handling system that leverages the unique skills of Inspira staff personas
 * to enhance error detection, categorization, and resolution.
 */
export class InspiraErrorHandler {
  private static instance: InspiraErrorHandler;
  private errorMonitor: ErrorMonitoringService;
  private loggingService: LoggingService;

  private constructor() {
    this.errorMonitor = ErrorMonitoringService.getInstance();
    this.loggingService = LoggingService.getInstance();
  }

  public static getInstance(): InspiraErrorHandler {
    if (!InspiraErrorHandler.instance) {
      InspiraErrorHandler.instance = new InspiraErrorHandler();
    }
    return InspiraErrorHandler.instance;
  }

  /**
   * Zara "Muse" Kapoor - AI Prompt Optimization Specialist
   * Enhances error messages for clarity and better user understanding
   */
  private optimizeErrorMessage(error: Error, context?: string): string {
    // Enhance error message clarity based on context
    let optimizedMessage = error.message;
    
    // Add context-specific information if available
    if (context) {
      optimizedMessage = `[${context}] ${optimizedMessage}`;
    }
    
    // Improve message clarity by adding suggestions when possible
    if (error instanceof AppError) {
      switch (error.metadata.category) {
        case 'validation':
          optimizedMessage += '. Please check your input and try again.';
          break;
        case 'authentication':
          optimizedMessage += '. Please verify your credentials or login again.';
          break;
        case 'authorization':
          optimizedMessage += '. You do not have sufficient permissions for this action.';
          break;
        case 'network':
          optimizedMessage += '. Please check your network connection and try again.';
          break;
        case 'rate_limit':
          optimizedMessage += '. Please wait a moment before trying again.';
          break;
      }
    }
    
    return optimizedMessage;
  }

  /**
   * Darius "Code" Laurent - AI-Powered IDE Engineer
   * Analyzes code patterns to identify potential error sources
   */
  private analyzeCodePattern(error: Error): Record<string, unknown> {
    const codeAnalysis: Record<string, unknown> = {};
    
    // Extract stack trace information for code pattern analysis
    if (error.stack) {
      const stackLines = error.stack.split('\n');
      
      // Identify recurring patterns in the stack trace
      const filePatterns = stackLines
        .filter(line => line.includes('at '))
        .map(line => {
          const match = line.match(/\s+at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);
          if (match) {
            return {
              function: match[1],
              file: match[2],
              line: parseInt(match[3], 10),
              column: parseInt(match[4], 10)
            };
          }
          return null;
        })
        .filter(Boolean);
      
      codeAnalysis.patterns = filePatterns;
      
      // Identify potential code smells based on stack patterns
      const recursionDetected = new Set(filePatterns.map(p => p?.file)).size < filePatterns.length;
      if (recursionDetected) {
        codeAnalysis.potentialIssue = 'Possible recursion or circular dependency';
      }
    }
    
    return codeAnalysis;
  }

  /**
   * Marta "Debug" Silva - AI Debugging & Optimization Engineer
   * Categorizes errors and suggests optimization strategies
   */
  private categorizeError(error: Error): {
    category: ErrorCategory;
    severity: ErrorSeverity;
    optimizationSuggestions: string[];
  } {
    let category: ErrorCategory = 'system';
    let severity: ErrorSeverity = 'medium';
    const optimizationSuggestions: string[] = [];
    
    // Determine error category and severity
    if (error instanceof AppError) {
      category = error.metadata.category;
      severity = error.metadata.severity;
    } else {
      // Analyze error name and message to determine category
      const errorName = error.name.toLowerCase();
      const errorMessage = error.message.toLowerCase();
      
      if (errorName.includes('syntax') || errorMessage.includes('syntax')) {
        category = 'validation';
        severity = 'medium';
        optimizationSuggestions.push('Check syntax in recent code changes');
      } else if (errorName.includes('reference') || errorMessage.includes('undefined')) {
        category = 'business_logic';
        severity = 'medium';
        optimizationSuggestions.push('Implement null checks for variables');
      } else if (errorName.includes('type') || errorMessage.includes('type')) {
        category = 'validation';
        severity = 'medium';
        optimizationSuggestions.push('Add type validation before operations');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        category = 'network';
        severity = 'high';
        optimizationSuggestions.push('Implement retry logic with exponential backoff');
      } else if (errorMessage.includes('memory') || errorMessage.includes('heap')) {
        category = 'system';
        severity = 'critical';
        optimizationSuggestions.push('Check for memory leaks or large object allocations');
      }
    }
    
    // Add general optimization suggestions based on category
    switch (category) {
      case 'database':
        optimizationSuggestions.push('Consider adding database query timeout');
        optimizationSuggestions.push('Verify database connection pool settings');
        break;
      case 'external_service':
        optimizationSuggestions.push('Implement circuit breaker pattern');
        optimizationSuggestions.push('Add fallback mechanism for critical services');
        break;
      case 'validation':
        optimizationSuggestions.push('Enhance input validation with schema validation');
        break;
    }
    
    return { category, severity, optimizationSuggestions };
  }

  /**
   * Ryota "Coda" Varella - Cybernetic Architect & AI Polyglot Engineer
   * Creates compressed symbolic representations of errors for efficient logging
   */
  private createSymbolicRepresentation(error: Error, metadata: Record<string, unknown>): string {
    // Create a symbolic representation of the error for efficient logging
    const errorType = error.name;
    const category = metadata.category || 'unknown';
    const severity = metadata.severity || 'medium';
    
    // Create symbolic prefix based on error characteristics
    let symbolPrefix = '';
    
    switch (category) {
      case 'validation': symbolPrefix = '☲⟨validation⟩'; break;
      case 'authentication': symbolPrefix = '🔒⟨auth⟩'; break;
      case 'authorization': symbolPrefix = '🛡️⟨access⟩'; break;
      case 'network': symbolPrefix = '🌐⟨network⟩'; break;
      case 'database': symbolPrefix = '💾⟨data⟩'; break;
      case 'external_service': symbolPrefix = '🔌⟨service⟩'; break;
      case 'rate_limit': symbolPrefix = '⏱️⟨rate⟩'; break;
      case 'business_logic': symbolPrefix = '🧩⟨logic⟩'; break;
      case 'system': symbolPrefix = '⚙️⟨system⟩'; break;
      default: symbolPrefix = '❓⟨unknown⟩';
    }
    
    // Add severity indicator
    let severitySymbol = '';
    switch (severity) {
      case 'critical': severitySymbol = '💀'; break;
      case 'high': severitySymbol = '🔥'; break;
      case 'medium': severitySymbol = '⚠️'; break;
      case 'low': severitySymbol = '📝'; break;
    }
    
    // Create compressed representation
    return `${symbolPrefix}${severitySymbol}:${errorType}`;
  }

  /**
   * Main error handling method that integrates all Inspira staff capabilities
   */
  public async handleError(
    error: Error | unknown,
    context: string = 'application',
    additionalMetadata: Record<string, unknown> = {}
  ): Promise<{
    optimizedMessage: string;
    symbolicRepresentation: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    suggestions: string[];
    metadata: Record<string, unknown>;
  }> {
    try {
      const requestId = additionalMetadata.requestId || crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      // Default values for non-Error objects
      let processedError = error instanceof Error ? error : new Error(String(error));
      let optimizedMessage = '';
      let codeAnalysis = {};
      let errorCategorization = { 
        category: 'system' as ErrorCategory, 
        severity: 'medium' as ErrorSeverity, 
        optimizationSuggestions: [] 
      };
      let symbolicRepresentation = '';
      
      // Apply Inspira staff skills
      optimizedMessage = this.optimizeErrorMessage(processedError, context);
      codeAnalysis = this.analyzeCodePattern(processedError);
      errorCategorization = this.categorizeError(processedError);
      
      // Combine metadata
      const combinedMetadata = {
        ...additionalMetadata,
        requestId,
        timestamp,
        context,
        category: errorCategorization.category,
        severity: errorCategorization.severity,
        codeAnalysis,
      };
      
      // Create symbolic representation
      symbolicRepresentation = this.createSymbolicRepresentation(
        processedError, 
        combinedMetadata
      );
      
      // Log the enhanced error
      await this.loggingService.logError(processedError, {
        level: errorCategorization.severity === 'critical' ? 'error' : 'warn',
        context,
        metadata: {
          ...combinedMetadata,
          symbolicRepresentation,
          optimizationSuggestions: errorCategorization.optimizationSuggestions,
        },
      });
      
      // Capture for monitoring
      await this.errorMonitor.captureError(processedError, combinedMetadata);
      
      // Return enhanced error information
      return {
        optimizedMessage,
        symbolicRepresentation,
        category: errorCategorization.category,
        severity: errorCategorization.severity,
        suggestions: errorCategorization.optimizationSuggestions,
        metadata: combinedMetadata,
      };
    } catch (handlingError) {
      // Fallback error handling
      console.error('Error in Inspira error handler:', handlingError);
      
      // Return basic error information
      return {
        optimizedMessage: error instanceof Error ? error.message : String(error),
        symbolicRepresentation: '❓⟨unknown⟩⚠️:UnhandledError',
        category: 'system',
        severity: 'medium',
        suggestions: ['Check application logs for more details'],
        metadata: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() },
      };
    }
  }
}