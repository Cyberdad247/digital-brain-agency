import { RateLimiterMemory } from 'rate-limiter-flexible';

export interface RateLimiterConfig {
  points: number;
  duration: number;
  blockDuration?: number;
}

export class RateLimiter {
  private limiter: RateLimiterMemory;

  constructor(config: RateLimiterConfig) {
    this.limiter = new RateLimiterMemory({
      points: config.points,
      duration: config.duration,
      blockDuration: config.blockDuration
    });
  }

  async consume(key: string): Promise<void> {
    try {
      await this.limiter.consume(key);
    } catch (error) {
      throw new Error('Rate limit exceeded');
    }
  }

  async get(key: string): Promise<number> {
    const res = await this.limiter.get(key);
    return res?.remainingPoints ?? 0;
  }
}