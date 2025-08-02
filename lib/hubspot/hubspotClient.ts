//hubspot client
"use server";

import { hubspotLimiter } from "./bottleneck";

export const hubspotRequest = async (
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  data?: any
): Promise<any> => {
  const baseUrl = process.env.LITTO_HUBSPOT_API_BASE!;
  const token = process.env.LITTO_HUBSPOT_ACCESS_TOKEN!;

  const performRequest = async () => {
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

  return hubspotLimiter.schedule(performRequest);
};
