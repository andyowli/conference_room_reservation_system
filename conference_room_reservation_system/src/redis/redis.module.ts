import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global() //把它声明为全局模块
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
              host: 'localhost',
              port: 6379
            },
            database: 1 //默认的 0,也就是放到不同命名空间下，避免冲突key-value
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
