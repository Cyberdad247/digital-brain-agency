import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorLogger = (error: Error) => {
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
};

export const errorResponder = (error: AppError, req: Request, res: Response) => {
  const status = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const invalidPathHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Invalid path',
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorLogger(err);

  if (err instanceof AppError) {
    return errorResponder(err, req, res);
  }

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return errorResponder(new AppError(400, 'Validation Error: ' + err.message), req, res);
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponder(new AppError(401, 'Unauthorized: ' + err.message), req, res);
  }

  // Default error
  return errorResponder(new AppError(500, 'Something went wrong'), req, res);
};
