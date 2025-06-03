"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { revalidatePath } from "next/cache";
import { unsaveContact } from "@/app/actions/prisma/unsaveContact";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSavedContactIds } from "@/app/actions/prisma/getSavedContacts";

export async function updateL2LeadStatus(
  contactId: string,
  status: string,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
) {
  try {
    // ✅ Update status in HubSpot
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}`,
      "PATCH",
      brand,
      {
        properties: {
          lead_status_l2: status,
        },
      }
    );

    // ✅ If status is "dropped off", check and unsave
    if (status === "Dropped Off") {
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;

      if (userId) {
        const savedContactIds = await getSavedContactIds();
        if (savedContactIds.includes(contactId)) {
          await unsaveContact(contactId);
        }
      }
    }

    revalidatePath(`/dashboard/contacts/${contactId}`);
    revalidatePath(`/dashboard`);

    return { success: true };
  } catch (error) {
    console.error("❌ updateL2LeadStatus error:", error);
    return {
      success: false,
      message: `Failed to update lead_status_l2: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    };
  }
}

// "use server";

// import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
// import { revalidatePath } from "next/cache";

// export async function updateL2LeadStatus(
//   contactId: string,
//   status: string,
//   brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
// ) {
//   try {
//     // Use central hubspotRequest with PATCH
//     await hubspotRequest(
//       `/crm/v3/objects/contacts/${contactId}`,
//       "PATCH",
//       brand,
//       {
//         properties: {
//           lead_status_l2: status,
//         },
//       }
//     );

//     // ✅ Optionally revalidate a specific contact page or tag
//     revalidatePath(`/dashboard/contacts/${contactId}`);
//     revalidatePath(`/dashboard`);

//     return { success: true };
//   } catch (error) {
//     console.error("❌ updateL2LeadStatus error:", error);

//     return {
//       success: false,
//       message: `Failed to update lead_status_l2: ${
//         error instanceof Error ? error.message : JSON.stringify(error)
//       }`,
//     };
//   }
// }
