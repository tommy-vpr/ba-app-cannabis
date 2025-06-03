"use server";

import { getHubspotCredentials } from "../getHubspotCredentials";
import { hubspotLimiter } from "./bottleneck";

export const hubspotRequest = async (
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  brand: "litto-cannabis" | "skwezed",
  data?: any
): Promise<any> => {
  const { baseUrl, token } = getHubspotCredentials(brand);

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
