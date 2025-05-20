// lib/hubspot/bottleneck.ts
import Bottleneck from "bottleneck";

export const hubspotLimiter = new Bottleneck({
  maxConcurrent: 1, // one request at a time per instance
  minTime: 300, // at least 300ms between requests → ~3.3 req/sec
  reservoir: 4, // initial burst capacity
  reservoirRefreshAmount: 4,
  reservoirRefreshInterval: 1000, // replenish 4 tokens every 1s
});
