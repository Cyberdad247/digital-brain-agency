'use client';

export class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public logError(error: Error, options: { level: string; context: string; metadata: Record<string, unknown> }): void {
    // TODO: Implement error logging logic
    console.error('Logged error:', error, options);
  }

  public logWarning(message: string, options: { level: string; context: string }): void {
    // TODO: Implement warning logging logic
    console.warn('Logged warning:', message, options);
  }
}