// app/lib/getHubSpotContact.ts (or similar)
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getHubSpotContact(
  contactId: string,
  brand: "litto-cannabis" | "skwezed" = "litto-cannabis"
) {
  return await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,company,jobtitle,address,city,state,zip,hs_lead_status,lead_status_l2`,
    "GET",
    brand
  );
}
