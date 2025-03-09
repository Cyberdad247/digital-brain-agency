import { ErrorLogger } from './ErrorLogger';

interface LoggingOptions {
  level: 'error' | 'warn' | 'info' | 'debug';
  context?: string;
  metadata?: Record<string, unknown>;
}

export class LoggingService {
  private static instance: LoggingService;
  private errorLogger: ErrorLogger;

  private constructor() {
    this.errorLogger = ErrorLogger.getInstance();
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public async logError(error: Error, options?: LoggingOptions): Promise<void> {
    const metadata = {
      level: options?.level || 'error',
      context: options?.context || 'application',
      timestamp: new Date().toISOString(),
      ...options?.metadata,
    };

    await this.errorLogger.logError(error, JSON.stringify(metadata));
  }

  public async logWarning(message: string, options?: LoggingOptions): Promise<void> {
    const warningError = new Error(message);
    await this.logError(warningError, { ...options, level: 'warn' });
  }

  public async logInfo(message: string, options?: LoggingOptions): Promise<void> {
    const infoError = new Error(message);
    await this.logError(infoError, { ...options, level: 'info' });
  }

  public async logDebug(message: string, options?: LoggingOptions): Promise<void> {
    const debugError = new Error(message);
    await this.logError(debugError, { ...options, level: 'debug' });
  }
}
