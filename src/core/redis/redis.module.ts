import { Module } from '@nestjs/common';

import { RedisService } from './redis.service';
import { redisClientFactory } from './redis-client.factory';

@Module({
    providers: [RedisService, redisClientFactory],
    exports: [RedisService],
})
export class RedisModule {}
