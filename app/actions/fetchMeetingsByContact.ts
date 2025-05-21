"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function fetchMeetingsByContact(
  contactId: string,
  brand: "litto-cannabis" | "skwezed"
) {
  // Step 1: Get associated meeting IDs
  const assocData = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}/associations/meetings`,
    "GET",
    brand
  );

  const meetingIds = assocData.results?.map((r: any) => r.id) ?? [];
  if (!meetingIds.length) return [];

  // Step 2: Batch read meeting details
  const detailsData = await hubspotRequest(
    `/crm/v3/objects/meetings/batch/read`,
    "POST",
    brand,
    {
      properties: [
        "hs_meeting_title",
        "hs_meeting_body",
        "hs_timestamp",
        "hs_meeting_outcome",
      ],
      inputs: meetingIds.map((id: string) => ({ id })),
    }
  );

  return (detailsData.results ?? []).sort((a: any, b: any) => {
    const timeA = new Date(a.properties?.hs_timestamp || 0).getTime();
    const timeB = new Date(b.properties?.hs_timestamp || 0).getTime();
    return timeB - timeA; // Descending order
  });
}
