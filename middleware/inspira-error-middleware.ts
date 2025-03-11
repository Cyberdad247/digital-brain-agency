import { NextRequest, NextResponse } from 'next/server';
import { InspiraErrorHandler } from '@/lib/error/InspiraErrorHandler';

/**
 * Inspira Error Middleware
 * 
 * This middleware integrates the Inspira staff personas into the error handling process,
 * providing enhanced error messages, code analysis, categorization, and symbolic representation.
 */
export async function inspiraErrorMiddleware(
  request: NextRequest,
  error: Error | unknown
) {
  const inspiraHandler = InspiraErrorHandler.getInstance();
  const url = request.nextUrl.pathname;
  const method = request.method;
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    // Process the error using Inspira staff capabilities
    const enhancedError = await inspiraHandler.handleError(error, 'api', {
      url,
      method,
      requestId,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    // Determine appropriate status code
    let statusCode = 500;
    switch (enhancedError.category) {
      case 'validation': statusCode = 400; break;
      case 'authentication': statusCode = 401; break;
      case 'authorization': statusCode = 403; break;
      case 'business_logic': 
        // For 'not found' errors specifically
        if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
          statusCode = 404;
        } else {
          statusCode = 422; // Unprocessable Entity
        }
        break;
      case 'rate_limit': statusCode = 429; break;
      case 'network': statusCode = 502; break;
      case 'external_service': statusCode = 503; break;
      case 'system': statusCode = 500; break;
    }

    // Create response with enhanced error information
    const errorResponse = {
      success: false,
      status: statusCode,
      message: enhancedError.optimizedMessage,
      requestId,
      category: enhancedError.category,
      severity: enhancedError.severity,
      symbol: enhancedError.symbolicRepresentation,
    };

    // Include suggestions and detailed error info in development
    if (process.env.NODE_ENV === 'development') {
      Object.assign(errorResponse, {
        suggestions: enhancedError.suggestions,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : String(error),
      });
    }

    // Return formatted error response
    return NextResponse.json(errorResponse, { status: statusCode });
  } catch (handlingError) {
    // Fallback error response if Inspira handler fails
    console.error('Error in Inspira error middleware:', handlingError);

    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: 'Internal Server Error',
        requestId,
        symbol: '❓⟨unknown⟩💀:UnhandledError',
      },
      { status: 500 }
    );
  }
}