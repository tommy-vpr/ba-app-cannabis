// app/actions/updateCompany.ts
"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

export async function updateCompany(
  companyId: string,
  data: Record<string, any>
) {
  // Map form data to HubSpot property names
  const properties = {
    legal_business_name: data.legal_business_name,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
  };

  return hubspotRequest(`/crm/v3/objects/companies/${companyId}`, "PATCH", {
    properties,
  });
}
