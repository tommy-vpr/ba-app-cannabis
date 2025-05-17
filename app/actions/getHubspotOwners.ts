"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

type HubspotOwner = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export async function getHubspotOwners(brand: "litto" | "skwezed") {
  try {
    const data = await hubspotRequest("/crm/v3/owners/", "GET", brand);

    return data.results.map((owner: HubspotOwner) => ({
      id: owner.id,
      name:
        owner.firstName && owner.lastName
          ? `${owner.firstName} ${owner.lastName}`
          : owner.email || `Owner ${owner.id}`,
      email: owner.email,
    }));
  } catch (err) {
    console.error("❌ Failed to fetch owners:", err);
    throw new Error("Failed to fetch owners");
  }
}
