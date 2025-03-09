const { RateLimiterMemory } = require('rate-limiter-flexible');

// Default rate limit configurations
const defaultRateLimits = {
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
const createRateLimiter = (config) => {
  return new RateLimiterMemory({
    points: config.points,
    duration: config.duration,
    blockDuration: config.blockDuration,
  });
};

// Rate limit middleware creator
const createRateLimitMiddleware = (config) => {
  const limiter = createRateLimiter(config);
  return async (req, res, next) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch (error) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
      });
    }
  };
};

module.exports = {
  defaultRateLimits,
  createRateLimiter,
  createRateLimitMiddleware,
};