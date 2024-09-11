import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '../resources/redis/redis.constants';

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

    async addUserAuthToken(userId: number, token: string): Promise<void> {
        const key = `session_key_${userId}`;
        await this.redisClient.set(key, token);
    }

    async getUserByAuthToken(userId: number): Promise<string> {
        const key = `session_key_${userId}`;
        return this.redisClient.get(key);
    }

    async removeUserAuthToken(userId: number): Promise<void> {
        const key = `session_key_${userId}`;
        await this.redisClient.del(key);
    }
}
