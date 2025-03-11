import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/lib/error/AppError';
import { ErrorMonitoringService } from '@/lib/error/ErrorMonitoringService';
import { LoggingService } from '@/lib/error/LoggingService';

/**
 * API Middleware
 * 
 * This middleware handles API requests, providing standardized request processing,
 * error handling, and monitoring.
 */
export async function apiMiddleware(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const errorMonitor = ErrorMonitoringService.getInstance();
  const loggingService = LoggingService.getInstance();
  const url = request.nextUrl.pathname;
  const method = request.method;
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  // Clone the request and add the request ID
  const requestWithId = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
  });
  requestWithId.headers.set('x-request-id', requestId);

  try {
    // Log the request
    await loggingService.logInfo(`API Request: ${method} ${url}`, {
      level: 'info',
      context: 'api',
      metadata: {
        url,
        method,
        requestId,
      },
    });

    // Process the request
    const response = await handler(requestWithId as NextRequest);
    
    // Add the request ID to the response
    response.headers.set('x-request-id', requestId);
    
    return response;
  } catch (error) {
    return handleApiError(request, error, requestId);
  }
}

/**
 * Handle API errors and return standardized error responses
 */
async function handleApiError(request: NextRequest, error: unknown, requestId: string) {
  const errorMonitor = ErrorMonitoringService.getInstance();
  const loggingService = LoggingService.getInstance();
  const url = request.nextUrl.pathname;
  const method = request.method;

  let statusCode = 500;
  let errorResponse: any = {
    success: false,
    status: statusCode,
    message: 'Internal Server Error',
    requestId,
  };

  try {
    // Handle AppError instances
    if (error instanceof AppError) {
      statusCode = error.statusCode;
      errorResponse.status = statusCode;
      errorResponse.message = error.message;
      errorResponse.category = error.metadata.category;
      
      // Log the error with context
      await loggingService.logError(error, {
        level: 'error',
        context: 'api',
        metadata: {
          ...error.metadata,
          url,
          method,
          requestId,
        },
      });

      // Capture for monitoring
      await errorMonitor.captureError(error, {
        additionalInfo: {
          url,
          method,
          requestId,
          ...error.metadata,
        },
      });
    } 
    // Handle standard Error objects
    else if (error instanceof Error) {
      // Determine error type from name
      switch (error.name) {
        case 'ValidationError':
          statusCode = 400;
          errorResponse.message = 'Validation Error';
          break;
        case 'UnauthorizedError':
        case 'JsonWebTokenError':
        case 'TokenExpiredError':
          statusCode = 401;
          errorResponse.message = 'Authentication Error';
          break;
        case 'ForbiddenError':
          statusCode = 403;
          errorResponse.message = 'Forbidden';
          break;
        case 'NotFoundError':
          statusCode = 404;
          errorResponse.message = 'Resource Not Found';
          break;
        case 'ConflictError':
          statusCode = 409;
          errorResponse.message = 'Resource Conflict';
          break;
        case 'RateLimitError':
          statusCode = 429;
          errorResponse.message = 'Too Many Requests';
          break;
        default:
          statusCode = 500;
      }

      errorResponse.status = statusCode;
      errorResponse.message = error.message || errorResponse.message;
      
      // Log the error
      await loggingService.logError(error, {
        level: 'error',
        context: 'api',
        metadata: {
          stack: error.stack,
          name: error.name,
          url,
          method,
          requestId,
        },
      });

      // Capture for monitoring
      await errorMonitor.captureError(error, {
        componentStack: error.stack,
        additionalInfo: {
          url,
          method,
          requestId,
        },
      });
    } 
    // Handle unknown error types
    else {
      const unknownError = new Error('Unknown error type');
      
      await loggingService.logError(unknownError, {
        level: 'error',
        context: 'api',
        metadata: { 
          originalError: error,
          url,
          method,
          requestId,
        },
      });
    }

    // Include detailed error info in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      errorResponse.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // Return formatted error response
    const response = NextResponse.json(errorResponse, { status: statusCode });
    response.headers.set('x-request-id', requestId);
    return response;
  } catch (handlingError) {
    // Log error handling failure
    console.error('Error in API error handler:', handlingError);

    // Return fallback error response
    const response = NextResponse.json(
      {
        success: false,
        status: 500,
        message: 'Internal Server Error',
        requestId,
      },
      { status: 500 }
    );
    response.headers.set('x-request-id', requestId);
    return response;
  }
}