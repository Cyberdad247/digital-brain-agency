'use client';

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

  private createErrorMetadata(metadata?: Partial<ErrorMetadata>): ErrorMetadata {
    const defaultMetadata: ErrorMetadata = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...metadata,
    };

    // Validate metadata
    if (defaultMetadata.environment !== 'development' && defaultMetadata.environment !== 'production') {
      throw new Error('Invalid environment value');
    }

    return defaultMetadata;
  }

  private async logToServices(error: Error, metadata: ErrorMetadata): Promise<void> {
    try {
      await Promise.all([
        this.loggingService.logError(error, {
          level: 'error',
          context: 'error-monitoring',
          metadata,
        }),
        this.errorLogger.logError(error, JSON.stringify(metadata)),
      ]);
    } catch (logError) {
      console.error('Error during logging:', logError);
    }
  }

  public async captureError(error: Error, metadata?: Partial<ErrorMetadata>): Promise<void> {
    const errorMetadata = this.createErrorMetadata(metadata);
    await this.logToServices(error, errorMetadata);

    // Analyze the error for trends and patterns
    try {
      const analytics = this.errorAnalytics.analyzeError(error, errorMetadata.componentStack);
      // Handle analytics result if necessary
    } catch (analyticsError) {
      console.error('Error during analysis:', analyticsError);
    }
  }

  public async captureWarning(message: string, metadata?: Partial<ErrorMetadata>): Promise<void> {
    const warningMetadata = this.createErrorMetadata(metadata);
    await this.loggingService.logWarning(message, {
      level: 'warn',
      context: 'error-monitoring',

