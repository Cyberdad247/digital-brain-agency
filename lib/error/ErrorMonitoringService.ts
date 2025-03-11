/**
 * Service for monitoring and capturing errors in the application.
 */
export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;

  private constructor() {}

  public static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  /**
   * Captures an error with optional metadata for monitoring.
   * @param error - The error to capture
   * @param metadata - Additional context about the error
   */
  public async captureError(error: Error, metadata?: Record<string, unknown>): Promise<void> {
    try {
      // In a production environment, you would typically send this to an error monitoring service
      // like Sentry, LogRocket, or similar
      if (process.env.NODE_ENV === 'production') {
        // Implementation for production error monitoring service
        console.error('[ErrorMonitoring] Error captured:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          metadata,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Development environment logging
        console.error('[ErrorMonitoring] Error captured:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          metadata,
        });
      }
    } catch (monitoringError) {
      // Fallback error logging if monitoring fails
      console.error('[ErrorMonitoring] Failed to capture error:', monitoringError);
    }
  }

  /**
   * Records a warning event that might indicate potential issues.
   * @param message - Warning message
   * @param metadata - Additional context about the warning
   */
  public async recordWarning(message: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Implementation for production warning monitoring
        console.warn('[ErrorMonitoring] Warning recorded:', {
          message,
          metadata,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Development environment logging
        console.warn('[ErrorMonitoring] Warning recorded:', {
          message,
          metadata,
        });
      }
    } catch (monitoringError) {
      console.error('[ErrorMonitoring] Failed to record warning:', monitoringError);
    }
  }
}