import { LRUCache } from 'lru-cache';
import fs from 'fs';
import path from 'path';

interface CacheOptions {
  max?: number;
  ttl?: number;
  persistPath?: string;
}

export class SupabaseCache {
  private cache: LRUCache<string, any>;
  private persistPath: string;

  constructor(options: CacheOptions = {}) {
    const {
      max = 500,
      ttl = 1000 * 60 * 5, // 5 minutes default TTL
      persistPath = path.join(process.cwd(), '.cache', 'supabase-cache.json')
    } = options;

    this.persistPath = persistPath;
    this.cache = new LRUCache({
      max,
      ttl,
      allowStale: false,
      updateAgeOnGet: true,
      updateAgeOnHas: true,

      // Optional callback for when items are evicted
      dispose: (value, key) => {
        console.log(`Cache item evicted: ${key}`);
      }
    });

    // Ensure cache directory exists
    const cacheDir = path.dirname(this.persistPath);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Load persisted cache on startup
    this.loadPersistedCache();

    // Setup periodic persistence
    setInterval(() => this.persistCache(), 1000 * 60); // Persist every minute
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key) as T | undefined;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cache.set(key, value, { ttl });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  private loadPersistedCache(): void {
    try {
      if (fs.existsSync(this.persistPath)) {
        const data = JSON.parse(fs.readFileSync(this.persistPath, 'utf8'));
        for (const [key, value] of Object.entries(data)) {
          this.cache.set(key, value);
        }
        console.log('Cache loaded from persistence');
      }
    } catch (error) {
      console.error('Error loading persisted cache:', error);
    }
  }

  private persistCache(): void {
    try {
      const data: Record<string, any> = {};
      for (const [key, value] of this.cache.entries()) {
        data[key] = value;
      }
      fs.writeFileSync(this.persistPath, JSON.stringify(data));
      console.log('Cache persisted to disk');
    } catch (error) {
      console.error('Error persisting cache:', error);
    }
  }

  // Utility methods for cache analysis
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      itemCount: this.cache.size,
      hasDispose: this.cache.hasDispose
    };
  }
}