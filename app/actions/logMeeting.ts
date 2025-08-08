"use server";

import {
  logMeetingSchema,
  LogMeetingFormValues,
} from "@/lib/validation/logMeetingSchema";
import { logMeetingToHubSpot } from "./logMeetingToHubSpot";

export async function logMeeting(
  data: LogMeetingFormValues & { contactId: string }
) {
  // Validate form input
  const result = logMeetingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || "Invalid meeting data");
  }

  try {
    const meeting = await logMeetingToHubSpot(data.contactId, data.body);
    return meeting;
  } catch (err) {
    console.error("[logMeeting error]", err);
    throw new Error("Failed to log meeting to HubSpot");
  }
}
