import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Configure Redis URL: use REDIS_URL env or default to localhost; remap 'redis' host to localhost in dev
let redisURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
try {
  const parsed = new URL(redisURL);
  if (parsed.hostname === 'redis') {
    parsed.hostname = '127.0.0.1';
    redisURL = parsed.toString();
    console.warn(`⚠️ Remapped Redis host to localhost: ${redisURL}`);
  }
} catch {
  // ignore invalid URL
}
export const redisClient = createClient({ url: redisURL });
redisClient.connect().catch(console.error);

export async function cacheable<T>(key: string, ttlSec: number, fetcher: () => Promise<T>): Promise<T> {
  // Try fetching from cache, but ignore Redis errors
  let cached: string | null = null;
  try {
    cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.error('Redis GET error:', err);
    // proceed to fetch without cache
  }
  // Fetch fresh data
  const data = await fetcher();
  // Try to store in cache, but ignore errors
  try {
    await redisClient.setEx(key, ttlSec, JSON.stringify(data));
  } catch (err) {
    console.error('Redis SET error:', err);
  }
  return data;
}
