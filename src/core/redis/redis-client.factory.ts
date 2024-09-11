import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'process';

import { REDIS_CLIENT } from '../resources/redis/redis.constants';

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: REDIS_CLIENT,
    useFactory: () => {
        const redisInstance = new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        });

        redisInstance.on('error', (e) => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [],
};
