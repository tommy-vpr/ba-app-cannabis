"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

export async function logMeetingToHubSpot(contactId: string, notes: string) {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // 1. Create the Meeting
  const meeting = await hubspotRequest("/crm/v3/objects/meetings", "POST", {
    properties: {
      hs_meeting_title: "Logged Meeting",
      hs_meeting_body: notes,
      hs_timestamp: now.toISOString(),
      hs_meeting_start_time: now.toISOString(),
      hs_meeting_end_time: oneHourLater.toISOString(),
      hs_meeting_outcome: "COMPLETED",
    },
  });

  // 2. Associate meeting to contact via v4
  await hubspotRequest(
    `/crm/v4/objects/meeting/${meeting.id}/associations/default/contact/${contactId}`,
    "PUT"
  );

  // 3. Get contact owner
  const contact = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}?properties=hubspot_owner_id,firstname,lastname`,
    "GET"
  );
  const ownerId = contact?.properties?.hubspot_owner_id;

  if (!ownerId) {
    console.warn(
      `No owner found for contact ${contactId}. Skipping task creation.`
    );
    return meeting;
  }

  // 4. Create follow-up task
  const taskProps = {
    hs_task_subject: "(BA) Follow up after meeting",
    hs_task_body: `Please follow up with ${
      contact.properties.firstname ?? ""
    } ${contact.properties.lastname ?? ""}.`,
    hs_task_status: "NOT_STARTED",
    hs_timestamp: now.toISOString(),
    hubspot_owner_id: ownerId,
  };

  const task = await hubspotRequest("/crm/v3/objects/tasks", "POST", {
    properties: taskProps,
  });

  // 5. Associate task to contact via v4
  await hubspotRequest(
    `/crm/v4/objects/task/${task.id}/associations/default/contact/${contactId}`,
    "PUT"
  );

  return meeting;
}

// "use server";
// import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

// export async function logMeetingToHubSpot(contactId: string, notes: string) {
//   const now = new Date();
//   const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

//   // 1. Create the Meeting + Associate to Contact in one request
//   const meeting = await hubspotRequest("/crm/v3/objects/meetings", "POST", {
//     properties: {
//       hs_meeting_title: "Logged Meeting",
//       hs_meeting_body: notes,
//       hs_timestamp: now.toISOString(),
//       hs_meeting_start_time: now.toISOString(),
//       hs_meeting_end_time: oneHourLater.toISOString(),
//       hs_meeting_outcome: "COMPLETED",
//     },
//     associations: [
//       {
//         to: { id: contactId },
//         types: [
//           {
//             associationCategory: "HUBSPOT_DEFINED",
//             associationTypeId: 200, // Default Meeting → Contact
//           },
//         ],
//       },
//     ],
//   });

//   // 2. Get contact owner
//   const contact = await hubspotRequest(
//     `/crm/v3/objects/contacts/${contactId}?properties=hubspot_owner_id,firstname,lastname`,
//     "GET"
//   );
//   const ownerId = contact?.properties?.hubspot_owner_id;

//   if (!ownerId) {
//     console.warn(
//       `No owner found for contact ${contactId}. Skipping task creation.`
//     );
//     return meeting;
//   }

//   // 3. Create a follow-up task + associate to contact & owner
//   // await hubspotRequest("/crm/v3/objects/tasks", "POST", {
//   //   properties: {
//   //     hs_task_subject: "Follow up after meeting",
//   //     hs_task_body: `Please follow up with ${
//   //       contact.properties.firstname ?? ""
//   //     } ${contact.properties.lastname ?? ""}.`,
//   //     hs_task_status: "NOT_STARTED",
//   //     hs_timestamp: now.toISOString(),
//   //   },
//   //   associations: [
//   //     {
//   //       to: { id: contactId },
//   //       types: [
//   //         {
//   //           associationCategory: "HUBSPOT_DEFINED",
//   //           associationTypeId: 204, // Task → Contact
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       to: { id: ownerId },
//   //       types: [
//   //         {
//   //           associationCategory: "HUBSPOT_DEFINED",
//   //           associationTypeId: 206, // Task → Owner
//   //         },
//   //       ],
//   //     },
//   //   ],
//   // });

//   return meeting;
// }
