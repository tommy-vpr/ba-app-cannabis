"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { getContactById } from "./getContactById";

type CreateTaskOptions = {
  brand: "litto-cannabis" | "skwezed";
  contactId: string;
  title: string;
  dueDate: Date;
  time?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  notes?: string;
};

export async function createTask({
  brand,
  contactId,
  title,
  dueDate,
  time = "08:00",
  priority = "NONE",
  notes = "",
}: CreateTaskOptions) {
  const contact = await getContactById(contactId, brand);
  const ownerId = contact?.properties?.hubspot_owner_id;

  if (!ownerId) {
    throw new Error(`❌ Contact ${contactId} has no owner assigned.`);
  }

  const [hour, minute] = time.split(":").map(Number);
  dueDate.setHours(hour, minute, 0, 0);

  const properties = {
    hs_task_subject: title,
    hs_task_body: notes,
    hs_timestamp: dueDate.toISOString(),
    hs_task_priority: priority,
    hs_task_status: "NOT_STARTED",
    hs_task_type: "TODO",
    hubspot_owner_id: ownerId,
    hs_queue_membership_ids: "9680031", // Static queue ID for now
  };

  const taskData = await hubspotRequest(
    `/crm/v3/objects/tasks`,
    "POST",
    brand,
    { properties }
  );

  await hubspotRequest(
    `/crm/v4/objects/task/${taskData.id}/associations/default/contact/${contactId}`,
    "PUT",
    brand
  );

  return taskData;
}
