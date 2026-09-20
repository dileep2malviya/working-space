import { RateLimiterRedis } from 'rate-limiter-flexible';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/errorApi.js';
import { Redis } from 'ioredis';
import { isConnected, redisConfig } from '../config/redisConnection.js';

export const redisClientForLimit = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 50, 2000),
});


const rateLimit = new RateLimiterRedis({
    storeClient: isConnected ? redisConfig : redisClientForLimit,
    keyPrefix: "token_bucket",
    points: 50,
    duration: 60,
    blockDuration: 30,
});

const rateLimitMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const clientIp = req.ip || 'unknown';
        const { remainingPoints } = await rateLimit.consume(clientIp);
        console.log(`Rate limit remaining points for ${clientIp}: ${remainingPoints}`);
        next();
    }
    catch (error) {
        console.log("Rate limit error :: ", error);
        throw new ApiError(429, "Too many requests, please try again later.");
    }
});

export { rateLimitMiddleware };
