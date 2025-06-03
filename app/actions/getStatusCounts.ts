"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import { StatusKey, StatusCount } from "@/types/status";

export async function getStatusCounts(
  brand: "litto-cannabis" | "skwezed",
  email: string // 👈 pass session user's email here
): Promise<StatusCount> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const counts: StatusCount = {
    all: 0,
    Assigned: 0,
    Visited: 0,
    "Dropped Off": 0,
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
        filterGroups: [
          {
            filters: [
              {
                propertyName: "ba_email",
                operator: "EQ",
                value: email,
              },
            ],
          },
        ],
        properties: ["hs_lead_status", "lead_status_l2"],
        limit: 100,
        after,
      }),
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
      const hsStatus = contact.properties.hs_lead_status;
      const l2Status = contact.properties.lead_status_l2;

      if (hsStatus === "Sent Samples" && l2Status && l2Status in counts) {
        counts[l2Status as keyof StatusCount]++;
      }
    }

    after = data.paging?.next?.after;
    hasMore = !!after;
  }

  return counts;
}
