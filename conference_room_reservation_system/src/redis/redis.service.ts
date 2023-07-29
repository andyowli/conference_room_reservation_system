import { Injectable,Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    @Inject('REDIS_CLIENT')
    private redisClient:RedisClientType;

    async get(key:string) {
        return await this.redisClient.get(key);
    }

    async set(key:string,value:string | number,ttl?:number) {
        // set 方法支持指定过期时间
        await this.redisClient.set(key,value);

        if(ttl) {
            // 设置 key 的过期时间
            await this.redisClient.expire(key,ttl);
        }
    }
}
