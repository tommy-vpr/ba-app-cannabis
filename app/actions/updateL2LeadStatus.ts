"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { revalidatePath } from "next/cache";

export async function updateL2LeadStatus(
  contactId: string,
  status: string,
  brand: "litto" | "skwezed" = "litto"
) {
  try {
    // Use central hubspotRequest with PATCH
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}`,
      "PATCH",
      brand,
      {
        properties: {
          l2_lead_status: status,
        },
      }
    );

    // ✅ Optionally revalidate a specific contact page or tag
    revalidatePath(`/dashboard/contacts/${contactId}`);
    revalidatePath(`/dashboard`);

    return { success: true };
  } catch (error) {
    console.error("❌ updateL2LeadStatus error:", error);

    return {
      success: false,
      message: `Failed to update l2_lead_status: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    };
  }
}
