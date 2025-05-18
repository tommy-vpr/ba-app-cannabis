import { hubspotRequest } from "@/lib/hubspot/hubspotClient"; // adjust the path if needed

export async function getHubSpotContact(
  contactId: string,
  brand: "litto" | "skwezed" = "litto"
) {
  return await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,phone,company,jobtitle,address,city,state,zip,l2_lead_status`,
    "GET",
    brand
  );
}
