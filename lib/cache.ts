import { Redis } from '@upstash/redis';

// Singleton pattern for Redis client
let redis: Redis | null = null;

export function getRedis() {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            throw new Error('Upstash Redis credentials are required');
        }

        redis = new Redis({
            url,
            token,
        });
    }

    return redis;
}

// Cache helper functions
export const cache = {
    // Get cached data
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await getRedis().get<T>(key);
            return data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    // Set cached data with optional expiration (in seconds)
    async set<T>(key: string, value: T, expiresIn?: number): Promise<void> {
        try {
            if (expiresIn) {
                await getRedis().setex(key, expiresIn, value);
            } else {
                await getRedis().set(key, value);
            }
        } catch (error) {
            console.error('Cache set error:', error);
        }
    },

    // Delete cached data
    async delete(key: string): Promise<void> {
        try {
            await getRedis().del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    },

    // Delete multiple keys matching a pattern
    async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await getRedis().keys(pattern);
            if (keys.length > 0) {
                await getRedis().del(...keys);
            }
        } catch (error) {
            console.error('Cache delete pattern error:', error);
        }
    },

    // Check if key exists
    async exists(key: string): Promise<boolean> {
        try {
            const result = await getRedis().exists(key);
            return result === 1;
        } catch (error) {
            console.error('Cache exists error:', error);
            return false;
        }
    },
};
