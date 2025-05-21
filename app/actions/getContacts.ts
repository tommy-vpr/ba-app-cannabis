// app/actions/getContacts.ts
"use server";

import { ContactFilter } from "@/types/filters";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getContacts(
  filter: ContactFilter & { after?: string },
  brand: "litto-cannabis" | "skwezed",
  email: string
) {
  const limit = filter.limit && filter.limit > 0 ? filter.limit : 12;

  const filters = [];

  // ✅ Now use the separate `email` param when needed
  // if (email) {
  //   filters.push({
  //     propertyName: "ba_email",
  //     operator: "EQ",
  //     value: email,
  //   });
  // }
  if (email && email.trim()) {
    filters.push({
      propertyName: "ba_email",
      operator: "EQ",
      value: email.trim().toLowerCase(),
    });
  }

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
    filterGroups: filters.length > 0 ? [{ filters }] : [],
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
      "l2_lead_status",
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
