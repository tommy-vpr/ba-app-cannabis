"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { getContactById } from "./getContactById";

const demoDaySchema = z.object({
  contactId: z.string(),
  name: z.string(),
  brand: z.string(),
  hubspotOwnerId: z.string(),
  eventType: z.literal("Demo Day"),
  location: z.string(),
  state: z.string(),
  startingInventory: z.string(),
  endingInventory: z.string(),
  unitsSold: z.string(),
  totalCustomers: z.string(),
  returningCustomers: z.string(),
  promos: z.string(),
  itemsCustomersBuying: z.string(),
  otherBrands: z.string(),
  optimizationOpportunities: z.string(),
  eventNotes: z.string(),
  improvementAreas: z.string(),
});

type DemoDayPayload = z.infer<typeof demoDaySchema>;

export async function createDemoDayTask(
  brand: "litto-cannabis" | "skwezed",
  payload: DemoDayPayload
) {
  const parsed = demoDaySchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("❌ Invalid form data");
  }

  const {
    contactId,
    name,
    eventType,
    hubspotOwnerId,
    brand: payloadBrand,
  } = parsed.data;

  const notes = Object.entries(parsed.data)
    .filter(
      ([key]) =>
        key !== "contactId" && key !== "hubspotOwnerId" && key !== "brand"
    )
    .map(([key, val]) => `${key.replace(/([A-Z])/g, " $1")}: ${val}`)
    .join("\n");

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  // Create task
  const taskRes = await hubspotRequest(`/crm/v3/objects/tasks`, "POST", brand, {
    properties: {
      hs_task_subject: `${eventType} - ${name}`,
      hs_task_body: notes,
      hs_timestamp: dueDate.toISOString(),
      hubspot_owner_id: hubspotOwnerId,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "MEDIUM",
      hs_task_type: "TODO",
      hs_queue_membership_ids: "132673490", // static queue
    },
  });

  // Associate task to contact
  await hubspotRequest(
    `/crm/v4/objects/task/${taskRes.id}/associations/default/contact/${contactId}`,
    "PUT",
    brand
  );

  revalidatePath(`/dashboard/contacts/${parsed.data.contactId}`);

  return { success: true };
}
