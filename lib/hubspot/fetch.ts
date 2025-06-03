// lib/hubspot/fetch.ts
"use server";

import { HubSpotContact } from "@/types/hubspot";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

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
  brand: "litto-cannabis" | "skwezed"
): Promise<HubSpotSearchResponse> {
  const { baseUrl, token } = getHubspotCredentials(brand);

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
    "lead_status_l2",
  ];

  const results: HubSpotContact[] = [];
  let after: string | undefined = undefined;
  let paging: HubSpotSearchResponse["paging"] = undefined;

  do {
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
        properties,
        limit: 100,
        after,
      }),
    });

    const data: HubSpotSearchResponse = await res.json();
    results.push(...(data.results ?? []));
    paging = data.paging;
    after = data.paging?.next?.after;
  } while (after);

  return { results, paging };
}

export async function fetchHubSpotContactsPaginated(
  limit: number,
  after: string,
  email: string,
  brand: "litto-cannabis" | "skwezed"
): Promise<HubSpotSearchResponse> {
  const { baseUrl, token } = getHubspotCredentials(brand);
  const properties = [
    "firstname",
    "lastname",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "hs_lead_status",
    "lead_status_l2",
    "ba_email",
  ];

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
      properties,
      limit,
      after: after || undefined,
    }),
  });

  return res.json();
}

export async function searchContactsByCompany(
  company: string,
  after = "",
  limit = 50,
  email?: string,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
): Promise<HubSpotSearchResponse> {
  const { baseUrl, token } = getHubspotCredentials(brand);
  const properties = [
    "firstname",
    "lastname",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "hs_lead_status",
    "lead_status_l2",
    "ba_email",
  ];

  const filters: any[] = [
    {
      propertyName: "company",
      operator: "CONTAINS_TOKEN",
      value: company,
    },
  ];

  if (email) {
    filters.push({
      propertyName: "ba_email",
      operator: "EQ",
      value: email,
    });
  }

  const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters,
        },
      ],
      properties,
      limit,
      after: after || undefined,
    }),
  });

  return res.json();
}

export async function searchContactsByStatus(
  status: string,
  after = "",
  limit = 50,
  email?: string,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
): Promise<HubSpotSearchResponse> {
  const { baseUrl, token } = getHubspotCredentials(brand);
  const properties = [
    "firstname",
    "lastname",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "hs_lead_status",
    "lead_status_l2",
    "ba_email",
  ];

  const filters: any[] = [
    {
      propertyName: "lead_status_l2",
      operator: "EQ",
      value: status,
    },
  ];

  if (email) {
    filters.push({
      propertyName: "ba_email",
      operator: "EQ",
      value: email,
    });
  }

  const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters,
        },
      ],
      properties,
      limit,
      after: after || undefined,
    }),
  });

  return res.json();
}
