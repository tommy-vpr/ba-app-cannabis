"use server";

import { getHubspotCredentials } from "../getHubspotCredentials";
import { hubspotLimiter } from "./bottleneck";

export const hubspotRequest = async (
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  brand: "litto" | "skwezed",
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

// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions"; // adjust path as needed
// import { getHubspotCredentials } from "../getHubspotCredentials";
// import { hubspotRateLimiter } from "./rateLimiter";

// export const hubspotRequest = async (
//   path: string,
//   method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
//   brand: "litto" | "skwezed",
//   data?: any
// ) => {
//   const { baseUrl, token } = getHubspotCredentials(brand);

//   // 🔐 Try to get session for user-based rate limit key
//   let rateLimitKey = "global-hubspot";

//   try {
//     const session = await getServerSession(authOptions);
//     const email = session?.user?.email;
//     if (email) {
//       rateLimitKey = `user-${email}-hubspot`;
//     }
//   } catch (err) {
//     console.warn("⚠️ Unable to load session for rate limiting:", err);
//   }

//   // 🚦 Rate limiting
//   const { success, reset } = await hubspotRateLimiter.limit(rateLimitKey);

//   if (!success) {
//     const waitMs = reset - Date.now();
//     throw new Error(
//       `Rate limit exceeded. Try again in ${Math.ceil(waitMs / 1000)}s`
//     );
//   }

//   const res = await fetch(`${baseUrl}${path}`, {
//     method,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body:
//       method === "GET" || method === "DELETE"
//         ? undefined
//         : JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`HubSpot API error: ${res.status} - ${text}`);
//   }

//   return res.json();
// };
