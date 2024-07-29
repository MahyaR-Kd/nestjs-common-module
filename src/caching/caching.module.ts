import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL', 86400000),
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        max: 10000,
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
