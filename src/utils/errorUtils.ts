import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 404, details);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 429, details);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 500, details);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.statusCode,
        details: err.details,
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 400,
        details: err.errors,
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
  }

  // Handle unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 500,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}

export function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
