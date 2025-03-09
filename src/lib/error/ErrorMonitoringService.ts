import { ErrorLogger } from './ErrorLogger';
import { LoggingService } from './LoggingService';
import { ErrorAnalyticsService } from './ErrorAnalyticsService';

interface ErrorMetadata {
  timestamp: string;
  environment: string;
  userAgent?: string;
  url?: string;
  componentStack?: string;
  additionalInfo?: Record<string, unknown>;
}

export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  private loggingService: LoggingService;
  private errorLogger: ErrorLogger;
  private errorAnalytics: ErrorAnalyticsService;

  private constructor() {
    this.loggingService = LoggingService.getInstance();
    this.errorLogger = ErrorLogger.getInstance();
    this.errorAnalytics = ErrorAnalyticsService.getInstance();
  }

  public static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  public async captureError(error: Error, metadata?: Partial<ErrorMetadata>): Promise<void> {
    const errorMetadata: ErrorMetadata = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...metadata,
    };

    // Log to all services for comprehensive error tracking
    await Promise.all([
      this.loggingService.logError(error, {
        level: 'error',
        context: 'error-monitoring',
        metadata: errorMetadata,
      }),
      this.errorLogger.logError(error, JSON.stringify(errorMetadata)),
    ]);

    // Analyze the error for trends and patterns
    const analytics = this.errorAnalytics.analyzeError(error, errorMetadata.componentStack);
  }

  public async captureWarning(message: string, metadata?: Partial<ErrorMetadata>): Promise<void> {
    await this.loggingService.logWarning(message, {
      level: 'warn',
      context: 'error-monitoring',
      metadata,
    });
  }

  public async captureInfo(message: string, metadata?: Partial<ErrorMetadata>): Promise<void> {
    await this.loggingService.logInfo(message, {
      level: 'info',
      context: 'error-monitoring',
      metadata,
    });
  }

  public getBrowserErrorMetadata(): Partial<ErrorMetadata> {
    if (typeof window === 'undefined') return {};

    return {
      userAgent: window.navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
