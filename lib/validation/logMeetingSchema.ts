// lib/validation/logMeetingSchema.ts
import { z } from "zod";

export const logMeetingSchema = z.object({
  newFirstName: z.string().min(1, "First name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  body: z.string().min(10, "Meeting notes must be at least 10 characters."),
  // l2Status: z.enum(["Visited", "Dropped Off"], {
  //   errorMap: () => ({ message: "Status is required" }),
  // }),
  leadStatusL2: z.enum(["Visited", "Dropped Off", "Not Started"]), // ⬅️ add this
});

export type LogMeetingFormValues = z.infer<typeof logMeetingSchema>;
