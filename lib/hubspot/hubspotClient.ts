// lib/hubspot/hubspotClient.ts
"use server";

import { getHubspotCredentials } from "../getHubspotCredentials";
import { hubspotRateLimiter } from "./rateLimiter";

export const hubspotRequest = async (
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  brand: "litto" | "skwezed",
  data?: any
) => {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const { success, reset } = await hubspotRateLimiter.limit("global-hubspot");

  if (!success) {
    const waitMs = reset - Date.now();
    throw new Error(`Rate limit exceeded. Try again in ${waitMs}ms`);
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body:
      method === "GET" || method === "DELETE"
        ? undefined
        : JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot API error: ${res.status} - ${text}`);
  }

  return res.json();
};
