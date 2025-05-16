"use server";

import { HubSpotContact } from "@/types/hubspot";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

interface HubSpotSearchResponse {
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

export async function fetchAllContactsByEmail(
  email: string,
  brand: "litto" | "skwezed"
): Promise<{
  results: HubSpotContact[];
  paging?: { next?: { after: string } };
}> {
  const properties = [
    "firstname",
    "lastname",
    "jobtitle",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "ba_email",
    "hs_lead_status",
    "l2_lead_status",
  ];

  const results: HubSpotContact[] = [];
  let after: string | undefined = undefined;
  let lastPaging: HubSpotSearchResponse["paging"] = undefined;

  do {
    const body = {
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
      properties,
      limit: 100,
      after,
    };

    const data: HubSpotSearchResponse = await hubspotRequest(
      `/crm/v3/objects/contacts/search`,
      "POST",
      brand,
      body
    );

    results.push(...(data.results ?? []));
    after = data.paging?.next?.after;
    lastPaging = data.paging;
  } while (after);

  return {
    results,
    paging: lastPaging,
  };
}
