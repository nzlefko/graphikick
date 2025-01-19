import { CacheEntry } from '@/types/footballOperations';

export class FootballCache {
  private static cache: Map<string, CacheEntry<any>> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static generateCacheKey(params: Record<string, any>): string {
    // Simple string-based key generation
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return JSON.stringify(sortedParams);
  }

  static get<T>(params: Record<string, any>): T | null {
    const key = this.generateCacheKey(params);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Using cached data for:', key);
      return cached.data as T;
    }

    return null;
  }

  static set<T>(params: Record<string, any>, data: T): void {
    const key = this.generateCacheKey(params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static clear(): void {
    this.cache.clear();
  }
}