"use server";

import { HubSpotContact } from "@/types/hubspot";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getContactById(
  id: string,
  brand: "litto-cannabis" | "skwezed"
): Promise<HubSpotContact | null> {
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
    "hubspot_owner_id",
  ];

  const query = new URLSearchParams({
    properties: properties.join(","),
  }).toString();

  try {
    const data = await hubspotRequest(
      `/crm/v3/objects/contacts/${id}?${query}`,
      "GET",
      brand
    );
    return data;
  } catch (err) {
    console.error("❌ Failed to fetch contact by ID:", err);
    return null;
  }
}
