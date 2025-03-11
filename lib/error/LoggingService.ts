/**
 * Service for logging errors and other events in the application.
 */
export class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Log levels for different severity of events
   */
  public readonly LOG_LEVELS = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
    fatal: 'fatal',
  } as const;

  type LogLevel = keyof typeof LoggingService.prototype.LOG_LEVELS;

  interface LogOptions {
    level: LogLevel;
    context?: string;
    metadata?: Record<string, unknown>;
  }

  /**
   * Logs an error with specified options
   * @param error - The error to log
   * @param options - Logging options including level, context, and metadata
   */
  public async logError(error: Error | unknown, options: LogOptions): Promise<void> {
    try {
      const { level = 'error', context = 'application', metadata = {} } = options;
      const timestamp = new Date().toISOString();
      
      // Format the error for logging
      const errorData = {
        timestamp,
        level,
        context,
        ...(error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : { message: String(error) }),
        ...metadata,
      };

      // In production, you would typically send this to a logging service
      // like Winston, Pino, or a cloud logging provider
      if (process.env.NODE_ENV === 'production') {
        // Production logging implementation
        console[level]('[Logging]', JSON.stringify(errorData));
      } else {
        // Development logging
        console[level]('[Logging]', errorData);
      }
    } catch (loggingError) {
      // Fallback if logging fails
      console.error('[Logging] Failed to log error:', loggingError);
    }
  }

  /**
   * Logs an informational message
   * @param message - The message to log
   * @param context - The context of the log
   * @param metadata - Additional metadata
   */
  public async logInfo(message: string, context = 'application', metadata = {}): Promise<void> {
    await this.logMessage(message, { level: 'info', context, metadata });
  }

  /**
   * Logs a warning message
   * @param message - The message to log
   * @param context - The context of the log
   * @param metadata - Additional metadata
   */
  public async logWarning(message: string, context = 'application', metadata = {}): Promise<void> {
    await this.logMessage(message, { level: 'warn', context, metadata });
  }

  /**
   * Logs a debug message
   * @param message - The message to log
   * @param context - The context of the log
   * @param metadata - Additional metadata
   */
  public async logDebug(message: string, context = 'application', metadata = {}): Promise<void> {
    await this.logMessage(message, { level: 'debug', context, metadata });
  }

  /**
   * Internal method to log a message with options
   */
  private async logMessage(message: string, options: LogOptions): Promise<void> {
    try {
      const { level = 'info', context = 'application', metadata = {} } = options;
      const timestamp = new Date().toISOString();
      
      const logData = {
        timestamp,
        level,
        context,
        message,
        ...metadata,
      };

      if (process.env.NODE_ENV === 'production') {
        // Production logging implementation
        console[level]('[Logging]', JSON.stringify(logData));
      } else {
        // Development logging
        console[level]('[Logging]', logData);
      }
    } catch (loggingError) {
      console.error('[Logging] Failed to log message:', loggingError);
    }
  }
}