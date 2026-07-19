import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async get<Type>(key: string): Promise<Type | null> {
    try {
      const data = await this.cacheManager.get<Type>(key);
      return data ?? null;
    } catch (error) {
      console.error(`Gagal mengambil data dari Redis untuk key "${key}":`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlInSeconds = 3600): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlInSeconds * 1000);
    } catch (error) {
      console.error(`Gagal menyimpan data ke Redis untuk key "${key}":`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      console.error(`Gagal menghapus data di Redis untuk key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheManager.clear();
    } catch (error) {
      console.error('Gagal mengosongkan cache Redis:', error);
    }
  }
}
