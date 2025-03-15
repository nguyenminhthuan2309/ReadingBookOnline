import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '@core/config/global';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;
    private readonly STREAM_KEY = 'stream_events';
    private readonly redisHost = redisConfig.host;
    private readonly redisPort = redisConfig.port;
    private readonly redisPassword = redisConfig.password;

    constructor() {
        this.redis = new Redis(`${this.redisHost}:${this.redisPort}`, { password: this.redisPassword });
    }

    async onModuleInit() {
        console.log('✅ Redis Connected!');
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    // Set Key-Value
    async set(key: string, value: string, ttl?: number): Promise<void> {
        await this.redis.set(key, value);
        if (ttl) {
            await this.redis.expire(key, ttl);
        }
    }

    // Get Key-Value
    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    // Delete Key
    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

    // Publish message (Pub/Sub)
    async publish(channel: string, message: string): Promise<void> {
        await this.redis.publish(channel, message);
    }

    // Subscribe message (Pub/Sub)
    async subscribe(channel: string, callback: (message: string) => void) {
        const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        await subscriber.subscribe(channel);
        subscriber.on('message', (ch, message) => {
            if (ch === channel) callback(message);
        });
    }

    // Redis Stream - Push data vào Stream
    async addToStream(event: string, data: any): Promise<void> {
        await this.redis.xadd(this.STREAM_KEY, '*', 'event', event, 'data', JSON.stringify(data));
    }

    // Redis Stream - Lấy dữ liệu từ Stream
    async readStream(count = 10): Promise<any[]> {
        const response = await this.redis.xrange(this.STREAM_KEY, '-', '+', 'COUNT', count);
        return response.map(([id, data]) => ({
            id,
            event: data[1],
            data: JSON.parse(data[3]),
        }));
    }

    // Redis Hashes - Set Hash
    async setHash(key: string, field: string, value: string): Promise<void> {
        await this.redis.hset(key, field, value);
    }

    // Redis Hashes - Get Hash
    async getHash(key: string, field: string): Promise<string | null> {
        return await this.redis.hget(key, field);
    }

    // Redis Hashes - Get toàn bộ Hash
    async getAllHash(key: string): Promise<Record<string, string>> {
        return await this.redis.hgetall(key);
    }
}
