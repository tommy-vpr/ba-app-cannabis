"use server";

import { ContactFilter } from "@/types/filters";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function getContacts(
  filter: ContactFilter & { after?: string },
  brand: "litto" | "skwezed"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);
  const limit = filter.limit && filter.limit > 0 ? filter.limit : 12;

  const filters = [];

  if (filter.status && filter.status.trim().toLowerCase() !== "all") {
    filters.push({
      propertyName: "l2_lead_status",
      operator: "EQ",
      value: filter.status.trim().toLowerCase(),
    });
  }

  if (filter.zip?.trim()) {
    filters.push({
      propertyName: "zip",
      operator: "EQ",
      value: filter.zip.trim(),
    });
  }

  if (filter.query) {
    filters.push({
      propertyName: "company",
      operator: "CONTAINS_TOKEN",
      value: filter.query,
    });
  }

  if (filter.address) {
    filters.push({
      propertyName: "address",
      operator: "CONTAINS",
      value: filter.address,
    });
  }

  const body = {
    filterGroups: filters.length ? [{ filters }] : [],
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    properties: [
      "firstname",
      "lastname",
      "email",
      "phone",
      "company",
      "zip",
      "address",
      "hs_lead_status",
      "l2_lead_status",
      "meeting_logs",
    ],
    limit,
    after: filter.after || undefined,
  };

  const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { tags: ["contacts"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot fetch error: ${res.status} - ${text}`);
  }

  const data = await res.json();

  return {
    contacts: data.results ?? [],
    hasNext: !!data.paging?.next,
    after: data.paging?.next?.after ?? null,
  };
}
