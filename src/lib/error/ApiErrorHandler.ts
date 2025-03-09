import { NextApiRequest, NextApiResponse } from 'next';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export const handleApiError = (error: unknown, req: NextApiRequest, res: NextApiResponse): void => {
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.statusCode.toString(),
        ...(error.details && { details: error.details }),
      },
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  const response: ErrorResponse = {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: '500',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error),
      }),
    },
  };
  res.status(500).json(response);
};

export const withErrorHandler =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(error, req, res);
    }
  };

// Common error instances
export const errors = {
  badRequest: (message = 'Bad request', details?: unknown) =>
    new ApiError(400, message, true, details),
  unauthorized: (message = 'Unauthorized', details?: unknown) =>
    new ApiError(401, message, true, details),
  forbidden: (message = 'Forbidden', details?: unknown) =>
    new ApiError(403, message, true, details),
  notFound: (message = 'Resource not found', details?: unknown) =>
    new ApiError(404, message, true, details),
  tooManyRequests: (message = 'Too many requests', details?: unknown) =>
    new ApiError(429, message, true, details),
  internal: (message = 'Internal server error', details?: unknown) =>
    new ApiError(500, message, false, details),
};
