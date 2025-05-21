"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContactUpdateSchema = z.object({
  company: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export async function updateContact(
  contactId: string,
  updates: z.infer<typeof ContactUpdateSchema>,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis" // Default to litto
) {
  const validated = ContactUpdateSchema.safeParse(updates);

  if (!validated.success) {
    throw new Error(
      "Validation failed: " + JSON.stringify(validated.error.format())
    );
  }

  await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}`,
    "PATCH",
    brand,
    { properties: validated.data }
  );

  // ✅ Revalidate the dashboard page so server-rendered data stays fresh
  // revalidatePath("/dashboard");
  // revalidatePath(`/dashboard/contacts/${contactId}`);
}
