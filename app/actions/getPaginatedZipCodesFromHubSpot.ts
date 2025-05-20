// app/actions/getPaginatedZipCodesFromHubSpot.ts
"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getPaginatedZipCodesFromHubSpot(
  brand: "litto" | "skwezed",
  after?: string
) {
  const uniqueZips = new Set<string>();

  const body = {
    properties: ["zip"],
    limit: 100,
    after,
  };

  const res = await hubspotRequest(
    "/crm/v3/objects/contacts/search",
    "POST",
    brand,
    body
  );

  for (const contact of res.results || []) {
    const zip = contact.properties?.zip?.trim();
    if (zip) uniqueZips.add(zip);
  }

  return {
    zips: Array.from(uniqueZips),
    after: res.paging?.next?.after ?? null,
    hasMore: Boolean(res.paging?.next?.after),
  };
}
