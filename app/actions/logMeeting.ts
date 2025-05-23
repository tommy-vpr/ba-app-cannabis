"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { createTask } from "./createTask";
import { getServerSession } from "next-auth";
import { getSavedContactIds } from "./prisma/getSavedContacts";
import { unsaveContact } from "./prisma/unsaveContact";
import { authOptions } from "@/lib/authOptions";

export async function logMeeting({
  brand,
  contactId,
  title,
  body,
  newFirstName,
  jobTitle,
  l2Status,
}: {
  brand: "litto-cannabis" | "skwezed";
  contactId: string;
  title: string;
  body: string;
  newFirstName?: string;
  jobTitle: string;
  l2Status: "assigned" | "visited" | "dropped off";
}) {
  const contact = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}?properties=firstname,jobtitle,company,l2_lead_status`,
    "GET",
    brand
  );

  const updates: Record<string, string> = {};
  if (newFirstName && newFirstName !== contact?.properties?.firstname)
    updates.firstname = newFirstName;
  if (jobTitle && jobTitle !== contact?.properties?.jobtitle)
    updates.jobtitle = jobTitle;
  if (l2Status && l2Status !== contact?.properties?.l2_lead_status)
    updates.l2_lead_status = l2Status;

  if (Object.keys(updates).length > 0) {
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}`,
      "PATCH",
      brand,
      { properties: updates }
    );
  }

  // ✅ If status was set to "dropped off", check and unsave
  if (l2Status === "dropped off") {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (userId) {
      const savedContactIds = await getSavedContactIds();
      if (savedContactIds.includes(contactId)) {
        await unsaveContact(contactId);
      }
    }
  }

  // 🧠 Task due 3 biz days from now
  const now = new Date();
  const dueDate = new Date(now);
  let daysAdded = 0;
  while (daysAdded < 3) {
    dueDate.setDate(dueDate.getDate() + 1);
    if (![0, 6].includes(dueDate.getDay())) daysAdded++;
  }

  await createTask({
    brand,
    contactId,
    title: "Follow up with BA sample drop off",
    dueDate,
    notes: `Meeting summary:\n${body}`,
  });

  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + 30 * 60000).toISOString();

  const meeting = await hubspotRequest(
    `/crm/v3/objects/meetings`,
    "POST",
    brand,
    {
      properties: {
        hs_meeting_title: `Met with ${newFirstName ?? "Contact"}`,
        hs_meeting_body: `Meeting with ${
          newFirstName ?? "Contact"
        } (${jobTitle}): ${body}`,
        hs_meeting_start_time: startTime,
        hs_meeting_end_time: endTime,
        hs_timestamp: now.getTime(),
        hs_meeting_outcome: "COMPLETED",
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 200,
            },
          ],
        },
      ],
    }
  );

  return meeting;
}
