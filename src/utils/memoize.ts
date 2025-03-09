import { LRUCache } from 'lru-cache';

interface MemoizeOptions {
  maxSize?: number;
  ttl?: number;
  cacheKeyFn?: (...args: any[]) => string;
}

/**
 * Creates a memoized version of a function that caches its results
 * using an LRU cache strategy.
 * 
 * @param fn The function to memoize
 * @param options Configuration options for the cache
 * @returns A memoized version of the input function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {}
): T {
  const {
    maxSize = 100,
    ttl = 1000 * 60 * 5, // 5 minutes default TTL
    cacheKeyFn = (...args: any[]) => JSON.stringify(args)
  } = options;

  const cache = new LRUCache<string, any>({
    max: maxSize,
    ttl,
    allowStale: false,
    updateAgeOnGet: true
  });

  return ((...args: Parameters<T>) => {
    const key = cacheKeyFn(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    // Handle both Promise and non-Promise results
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value);
        return value;
      });
    }

    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified wait time has elapsed since the last call.
 * 
 * @param fn The function to debounce
 * @param wait The number of milliseconds to wait
 * @returns A debounced version of the input function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a throttled version of a function that limits how often it can be called.
 * 
 * @param fn The function to throttle
 * @param limit The minimum number of milliseconds between function calls
 * @returns A throttled version of the input function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}