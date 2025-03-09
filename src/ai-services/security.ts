import { AIServiceError } from './types';

// Define validation schema interface outside the class
export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
  };
}

export interface SecurityOptions {
  enableRateLimit: boolean;
  enableInputValidation: boolean;
  enableApiKeyValidation: boolean;
}

type RateLimiter = {
  requests: number;
  lastReset: number;
  duration: number;
  limit: number;
};

export class SecurityManager {
  private static instance: SecurityManager;
  private options: SecurityOptions;
  private rateLimiters: Map<string, RateLimiter>;

  private constructor() {
    this.options = {
      enableRateLimit: true,
      enableInputValidation: true,
      enableApiKeyValidation: true
    };
    this.rateLimiters = new Map();
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  configure(options: Partial<SecurityOptions>): void {
    this.options = { ...this.options, ...options };
  }

  validateApiKey(apiKey: string | undefined): void {
    if (!this.options.enableApiKeyValidation) return;

    if (!apiKey) {
      throw new AIServiceError('API key is required', 'INVALID_API_KEY');
    }

    if (typeof apiKey !== 'string' || apiKey.length < 32) {
      throw new AIServiceError('Invalid API key format', 'INVALID_API_KEY');
    }
  }

  validateInput(input: unknown, schema: ValidationSchema): void {
    if (!this.options.enableInputValidation) return;

    if (!input || typeof input !== 'object' || input === null) {
      throw new AIServiceError('Invalid input', 'INVALID_INPUT');
    }

    const typedInput = input as Record<string, unknown>;

    for (const [key, validator] of Object.entries(schema)) {
      const value = typedInput[key];
      
      if (validator.required && value === undefined) {
        throw new AIServiceError(`Missing required field: ${key}`, 'INVALID_INPUT');
      }

      if (value !== undefined) {
        const typeMatch = this.checkType(value, validator.type);
        if (!typeMatch) {
          throw new AIServiceError(
            `Invalid type for field ${key}. Expected ${validator.type}, got ${typeof value}`,
            'INVALID_INPUT'
          );
        }
      }
    }
  }

  private checkType(value: unknown, expectedType: string): boolean {
    if (expectedType === 'array') return Array.isArray(value);
    if (expectedType === 'object') return typeof value === 'object' && value !== null;
    return typeof value === expectedType;
  }

  checkRateLimit(clientId: string, limit: number, duration: number): void {
    if (!this.options.enableRateLimit) return;

    const now = Date.now();
    let limiter = this.rateLimiters.get(clientId);

    if (!limiter) {
      limiter = {
        requests: 0,
        lastReset: now,
        duration,
        limit
      };
      this.rateLimiters.set(clientId, limiter);
    }

    // Reset counter if duration has passed
    if (now - limiter.lastReset >= limiter.duration * 1000) {
      limiter.requests = 0;
      limiter.lastReset = now;
    }

    if (limiter.requests >= limiter.limit) {
      const resetTime = Math.ceil(
        (limiter.lastReset + limiter.duration * 1000 - now) / 1000
      );
      throw new AIServiceError(
        `Rate limit exceeded. Try again in ${resetTime} seconds`,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    limiter.requests++;
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .trim();
  }

  validateEndpoint(endpoint: string | undefined): void {
    if (!endpoint) {
      throw new AIServiceError('Endpoint is required', 'INVALID_ENDPOINT');
    }

    try {
      new URL(endpoint);
    } catch (error) {
      throw new AIServiceError('Invalid endpoint URL', 'INVALID_ENDPOINT');
    }
  }
}

export const securityManager = SecurityManager.getInstance();