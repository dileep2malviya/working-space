import { Redis } from "ioredis";
import { ApiError } from "../utils/errorApi.js";
const redisConfig = {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
};

let redisClient = null;
let isConnected = false;
export async function connectRedis() {
    if (isConnected) {
        console.log("Redis already connected");
        return;
    }
    try {
        redisClient = new Redis(process.env.REDIS_URL,redisConfig);
        await redisClient.ping();
        isConnected = true;
        console.log("Redis connected successfully");
    }
    catch (error) {
        console.warn("Redis unavailable; continuing without it.", error.message || error);
        redisClient = null;
        isConnected = false;
        return false;
    }
}
const setRedisFunction = async (key, value, ttl) => {
    try {
        if (!redisClient) {
            throw new ApiError(503, "The service is temporarily down, try again later.");
        }
        await redisClient.set(key, value, "EX", ttl);
    }
    catch (error) {
        console.error(`Redis SET failed :`, error);
        throw error;
    }
};
const getRedisFunction = async (key) => {
    try {
        if (!redisClient) {
            throw new ApiError(503, "The service is temporarily down, try again later.");
        }
        const value = await redisClient.get(key);
        return value;
    }
    catch (error) {
        console.error(`Redis GET failed :`, error);
        throw error;
    }
};
export const checkRateLimit = async ({ key, limit = 20, ttl }) => {
    if (!redisClient) {
        throw new ApiError(503, "The service is temporarily down, try again later.");
    }
    const count = await redisClient.incr(key);
    if (count === 1) {
        await redisClient.expire(key, ttl);
    }
    if (count > limit) {
        const retryAfter = await redisClient.ttl(key);
        throw new ApiError(429, `Too many requests. Try again after ${retryAfter} seconds.`);
    }
};
const deleteDataFromRedis = async (key) => {
    try {
        if (!redisClient) {
            throw new ApiError(503, "The service is temporarily down, try again later.");
        }
        const deleted = await redisClient.del(key);
        return deleted;
    }
    catch (error) {
        console.error(`Redis DELETE failed :`, error);
        throw error;
    }
};
const checkRedisHealth = async () => {
    try {
        if (!redisClient) {
            console.warn("Redis not initialized");
            return false;
        }
        const result = await redisClient.ping();
        console.log("Redis health check passed:", result);
        return true;
    }
    catch (error) {
        console.error("Redis health check failed:", error);
        return false;
    }
};
const disconnectRedis = async () => {
    try {
        if (redisClient)
            await redisClient.quit();
        isConnected = false;
        console.log("Redis connection closed gracefully");
    }
    catch (error) {
        console.error("Error closing Redis connection:", error);
    }
};
export { redisClient, redisConfig, isConnected, checkRedisHealth, setRedisFunction, getRedisFunction, deleteDataFromRedis, disconnectRedis, };
