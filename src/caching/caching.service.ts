import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getRedisClient() {
    return this.cacheManager.store;
  }

  async get<T>(key: string) {
    const result: string = await this.cacheManager.get<undefined | string>(key);
    // JSON parse result
    if (result) {
      return JSON.parse(result) as T;
    }
    return result as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    // stringify value
    return await this.cacheManager.set(
      key,
      JSON.stringify(value),
      ttlSeconds * 1000,
    );
  }

  async del(key: string): Promise<void> {
    return await this.cacheManager.del(key);
  }
}
