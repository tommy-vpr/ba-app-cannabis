"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getOrCreateTaskQueue(
  brand: "litto" | "skwezed",
  queueName = "Ba sample drop off"
): Promise<string | null> {
  try {
    // Step 1: Get existing queues
    const listData = await hubspotRequest(
      `/crm/v3/objects/queues`,
      "GET",
      brand
    );

    const existing = listData?.results?.find(
      (q: any) =>
        q.properties?.name?.trim().toLowerCase() === queueName.toLowerCase()
    );

    if (existing) return existing.id;

    // Step 2: Create new queue if not found
    const createData = await hubspotRequest(
      `/crm/v3/objects/queues`,
      "POST",
      brand,
      {
        properties: {
          name: queueName,
        },
      }
    );

    return createData?.id ?? null;
  } catch (err) {
    console.error("❌ Failed in getOrCreateTaskQueue:", err);
    return null;
  }
}
