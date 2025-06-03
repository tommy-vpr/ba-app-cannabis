"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ContactSchema, CreateContactFormValues } from "@/lib/schemas";
import { getHubspotOwners } from "./getHubspotOwners";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function createNewContact(
  input: CreateContactFormValues,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions);
    const baEmail = session?.user?.email;
    if (!baEmail) throw new Error("Unauthorized: Please log in");

    // 2. Get HubSpot owners and select preferred one
    const owners = await getHubspotOwners(brand);
    const preferredOwner = owners.find(
      (owner: any) => owner.email?.toLowerCase() === "hemp@itslitto.com"
    );
    const ownerId = preferredOwner?.id || owners?.[0]?.id;

    if (!ownerId) throw new Error("No available HubSpot owner found");

    // 3. Validate + enrich input
    const result = ContactSchema.safeParse({
      ...input,
      ba_email: baEmail,
      hs_lead_status: "Sent Samples",
      lead_status_l2: "Assigned",
      hubspot_owner_id: ownerId,
    });

    if (!result.success) {
      throw new Error(
        result.error.errors[0]?.message || "Invalid form submission"
      );
    }

    // 4. Submit to HubSpot using helper
    const res = await hubspotRequest(
      "/crm/v3/objects/contacts",
      "POST",
      brand,
      { properties: result.data }
    );

    return {
      success: true,
      contactId: res.id,
      contact: {
        id: res.id,
        properties: res.properties,
      },
    };
  } catch (err: any) {
    console.error("❌ createNewContact error:", err);
    return {
      success: false,
      message: err.message || "Unknown error occurred.",
    };
  }
}
