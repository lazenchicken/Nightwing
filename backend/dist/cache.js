"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.cacheable = cacheable;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
exports.redisClient.connect().catch(console.error);
async function cacheable(key, ttlSec, fetcher) {
    const cached = await exports.redisClient.get(key);
    if (cached)
        return JSON.parse(cached);
    const data = await fetcher();
    await exports.redisClient.setEx(key, ttlSec, JSON.stringify(data));
    return data;
}
