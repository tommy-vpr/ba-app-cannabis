// lib/hubspot/rateLimiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const hubspotRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(4, "1s"), // 4 requests per second
  analytics: true,
  prefix: "hubspot-global",
});
