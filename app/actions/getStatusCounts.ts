"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import { StatusKey, StatusCount } from "@/types/status";

export async function getStatusCounts(
  brand: "litto" | "skwezed"
): Promise<StatusCount> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const counts: StatusCount = {
    all: 0,
    "pending visit": 0,
    "visit requested by rep": 0,
    "dropped off": 0,
  };

  let hasMore = true;
  let after: string | undefined;

  while (hasMore) {
    const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: ["hs_lead_status", "l2_lead_status"],
        limit: 100, // ✅ within API bounds
        after,
      }),
      // ✅ Cache result for 60 seconds to avoid rate limits
      next: {
        revalidate: 60,
        tags: ["statusCounts"],
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to fetch contacts: ${error}`);
    }

    const data = await res.json();
    const results = data.results ?? [];
    counts.all += results.length;

    for (const contact of results) {
      const hsStatus = contact.properties.hs_lead_status?.toLowerCase().trim();
      const l2Status = contact.properties.l2_lead_status?.toLowerCase().trim();

      if (hsStatus === "samples" && l2Status && l2Status in counts) {
        counts[l2Status as keyof StatusCount]++;
      }
    }

    after = data.paging?.next?.after;
    hasMore = !!after;
  }

  return counts;
}
