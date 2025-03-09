import { RateLimiterMemory } from 'rate-limiter-flexible';

export interface RateLimitConfig {
  points: number; // Number of points
  duration: number; // Per duration in seconds
  blockDuration?: number; // Block duration in seconds
}

export interface RateLimitOptions {
  api: RateLimitConfig;
  auth: RateLimitConfig;
  speech: RateLimitConfig;
}

// Default rate limit configurations
export const defaultRateLimits: RateLimitOptions = {
  api: {
    points: 100, // 100 requests
    duration: 60, // per 1 minute
    blockDuration: 60, // Block for 1 minute if exceeded
  },
  auth: {
    points: 5, // 5 attempts
    duration: 300, // per 5 minutes
    blockDuration: 900, // Block for 15 minutes if exceeded
  },
  speech: {
    points: 50, // 50 requests
    duration: 3600, // per hour
    blockDuration: 1800, // Block for 30 minutes if exceeded
  },
};

// Create rate limiters
export const createRateLimiter = (config: RateLimitConfig) => {
  return new RateLimiterMemory({
    points: config.points,
    duration: config.duration,
    blockDuration: config.blockDuration,
  });
};

// Rate limit middleware creator
export const createRateLimitMiddleware = (limiter: RateLimiterMemory) => {
  return async (req: any, res: any, next: any) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch (error) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Please try again later',
      });
    }
  };
};
