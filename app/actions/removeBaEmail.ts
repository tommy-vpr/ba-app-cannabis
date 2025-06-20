// app/actions/removeBaEmail.ts
"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RemoveSchema = z.object({
  contactId: z.string().min(1),
  brand: z.enum(["litto-cannabis", "skwezed"]),
});

export async function removeBaEmail(
  contactId: string,
  brand: "litto-cannabis" | "skwezed"
) {
  const validated = RemoveSchema.safeParse({ contactId, brand });
  if (!validated.success) {
    throw new Error("Invalid input for removing BA Email");
  }

  try {
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}`,
      "PATCH",
      brand,
      { properties: { ba_email: "" } }
    );
  } catch (err: any) {
    // 👇 Handle missing contacts without crashing
    if (err.message?.includes("404")) {
      console.warn(`Contact ${contactId} not found (already deleted).`);
      return null;
    }
    throw err;
  }
}
