// app/actions/updateAssociatedCompanyLeadStatusL2.ts
"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient"; // same client you use elsewhere

export async function updateAssociatedCompanyLeadStatusL2(
  contactId: string,
  status: "Visited" | "Dropped Off" | "Not Started"
) {
  // 1) Get associated companies for the contact
  const assoc = await hubspotRequest(
    `/crm/v4/objects/contacts/${contactId}/associations/companies`,
    "GET"
  );

  const companyId =
    assoc?.results?.[0]?.to?.id || assoc?.results?.[0]?.toObjectId; // support both shapes

  if (!companyId) {
    throw new Error("No associated company found for this contact.");
  }

  // 2) Update the company's lead_status_l2
  await hubspotRequest(`/crm/v3/objects/companies/${companyId}`, "PATCH", {
    properties: { lead_status_l2: status },
  });

  return { companyId, status };
}
