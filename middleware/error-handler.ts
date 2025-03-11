import { NextResponse } from 'next/server';
import { AppError, ErrorCategory, ErrorSeverity } from '@/lib/error/AppError';
import { ErrorMonitoringService } from '@/lib/error/ErrorMonitoringService';
import { LoggingService } from '@/lib/error/LoggingService';

interface ErrorResponse {
  success: boolean;
  status: number;
  message: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  error?: unknown;
}

/**
 * Global error handler middleware
 * 
 * This middleware handles errors throughout the application, providing standardized error responses,
 * logging, and error monitoring.
 */
export async function errorHandler(error: Error | unknown) {
  const errorMonitor = ErrorMonitoringService.getInstance();
  const loggingService = LoggingService.getInstance();
  const requestId = crypto.randomUUID();

  let response: ErrorResponse = {
    success: false,
    status: 500,
    message: 'Internal Server Error',
  };

  try {
    // Handle AppError instances
    if (error instanceof AppError) {
      response.status = error.statusCode;
      response.message = error.message;
      response.category = error.metadata.category;
      response.severity = error.metadata.severity;
      
      // Log the error with context
      await loggingService.logError(error, {
        level: error.metadata.severity === 'critical' ? 'error' : 'warn',
        context: 'middleware',
        metadata: {
          ...error.metadata,
          requestId,
        },
      });

      // Capture for monitoring
      await errorMonitor.captureError(error, {
        additionalInfo: {
          requestId,
          ...error.metadata,
        },
      });
    }
    // Handle standard Error objects
    else if (error instanceof Error) {
      // Log the error with full context
      await loggingService.logError(error, {
        level: 'error',
        context: 'middleware',
        metadata: {
          stack: error.stack,
          name: error.name,
          requestId,
        },
      });

      // Capture error for monitoring
      await errorMonitor.captureError(error, {
        componentStack: error.stack,
        additionalInfo: {
          requestId,
        },
      });

      // Handle specific error types
      switch (error.name) {
        case 'ValidationError':
          response.status = 400;
          response.message = 'Validation Error';
          response.category = 'validation';
          break;
        case 'UnauthorizedError':
        case 'JsonWebTokenError':
        case 'TokenExpiredError':
          response.status = 401;
          response.message = 'Authentication Error';
          response.category = 'authentication';
          break;
        case 'ForbiddenError':
          response.status = 403;
          response.message = 'Forbidden';
          response.category = 'authorization';
          break;
        case 'NotFoundError':
          response.status = 404;
          response.message = 'Not Found';
          response.category = 'business_logic';
          break;
        case 'ConflictError':
          response.status = 409;
          response.message = 'Resource Conflict';
          response.category = 'business_logic';
          break;
        case 'RateLimitError':
          response.status = 429;
          response.message = 'Too Many Requests';
          response.category = 'rate_limit';
          break;
        default:
          response.category = 'system';
          if (process.env.NODE_ENV === 'development') {
            response.error = {
              name: error.name,
              message: error.message,
              stack: error.stack,
            };
          }
      }

      response.message = error.message || response.message;
    } 
    // Handle non-Error objects
    else {
      const unknownError = new Error('Unknown error type');
      
      await loggingService.logError(unknownError, {
        level: 'error',
        context: 'middleware',
        metadata: { 
          originalError: error,
          requestId,
        },
      });
      
      // Attempt to convert to string if possible
      if (typeof error === 'string') {
        response.message = error;
      } else if (error && typeof error === 'object') {
        try {
          response.message = JSON.stringify(error);
        } catch (e) {
          // Keep default message if stringify fails
        }
      }
    }

    // Return error response
    return NextResponse.json(response, { status: response.status });
  } catch (handlingError) {
    // Log error handling failure
    console.error('Error in error handler:', handlingError);

    // Return fallback error response
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}