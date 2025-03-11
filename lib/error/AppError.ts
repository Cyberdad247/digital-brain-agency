export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ErrorCategory =
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'network'
  | 'database'
  | 'external_service'
  | 'rate_limit'
  | 'business_logic'
  | 'system';

export interface ErrorMetadata {
  severity: ErrorSeverity;
  category: ErrorCategory;
  code?: string;
  details?: Record<string, unknown>;
  source?: string;
  timestamp?: string;
  requestId?: string;
  userId?: string;
  path?: string;
}

export class AppError extends Error {
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata: ErrorMetadata;

  constructor(
    message: string,
    statusCode: number = 500,
    metadata: Partial<ErrorMetadata> = {}
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = this.statusCode < 500;

    // Set default metadata
    this.metadata = {
      severity: metadata.severity || this.calculateSeverity(),
      category: metadata.category || this.determineCategory(),
      timestamp: metadata.timestamp || new Date().toISOString(),
      ...metadata,
    };

    Error.captureStackTrace(this, this.constructor);
  }

  private calculateSeverity(): ErrorSeverity {
    if (this.statusCode >= 500) return 'critical';
    if (this.statusCode === 429) return 'high';
    if (this.statusCode >= 400) return 'medium';
    return 'low';
  }

  private determineCategory(): ErrorCategory {
    switch (this.statusCode) {
      case 400:
        return 'validation';
      case 401:
        return 'authentication';
      case 403:
        return 'authorization';
      case 404:
        return 'business_logic';
      case 429:
        return 'rate_limit';
      case 502:
      case 503:
      case 504:
        return 'external_service';
      default:
        return this.statusCode >= 500 ? 'system' : 'business_logic';
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      metadata: this.metadata,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }

  // Factory methods for common error types
  static validation(message: string, details?: Record<string, unknown>) {
    return new AppError(message, 400, {
      category: 'validation',
      severity: 'medium',
      details,
    });
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 401, {
      category: 'authentication',
      severity: 'medium',
    });
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 403, {
      category: 'authorization',
      severity: 'high',
    });
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, 404, {
      category: 'business_logic',
      severity: 'low',
    });
  }

  static rateLimit(message: string = 'Too many requests') {
    return new AppError(message, 429, {
      category: 'rate_limit',
      severity: 'high',
    });
  }

  static internal(message: string = 'Internal server error') {
    return new AppError(message, 500, {
      category: 'system',
      severity: 'critical',
    });
  }
}