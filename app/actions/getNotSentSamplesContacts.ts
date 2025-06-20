"use server";

import { ContactFilter } from "@/types/filters";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getNotSentSamplesContacts(
  filter: ContactFilter & { after?: string },
  brand: "litto-cannabis" | "skwezed",
  email: string
) {
  const limit = filter.limit && filter.limit > 0 ? filter.limit : 12;

  const filters = [];

  // Filter by email
  if (email && email.trim()) {
    filters.push({
      propertyName: "ba_email",
      operator: "EQ",
      value: email.trim().toLowerCase(),
    });
  }

  // Exclude Sent Samples status
  filters.push({
    propertyName: "hs_lead_status",
    operator: "NEQ", // 👈 NOT EQUAL TO
    value: "Sent Samples",
  });

  // Optional: Add query, zip, etc.
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
    filterGroups: [{ filters }],
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    properties: [
      "firstname",
      "lastname",
      "jobtitle",
      "email",
      "phone",
      "company",
      "city",
      "state",
      "zip",
      "address",
      "ba_email",
      "hs_lead_status",
      "lead_status_l2",
      "meeting_logs",
    ],
    limit,
    after: filter.after || undefined,
  };

  const data = await hubspotRequest(
    "/crm/v3/objects/contacts/search",
    "POST",
    brand,
    body
  );

  return {
    contacts: data.results ?? [],
    hasNext: !!data.paging?.next,
    after: data.paging?.next?.after ?? null,
  };
}
