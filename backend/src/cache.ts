import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);

export async function cacheable<T>(key: string, ttlSec: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached) as T;
  const data = await fetcher();
  await redisClient.setEx(key, ttlSec, JSON.stringify(data));
  return data;
}
