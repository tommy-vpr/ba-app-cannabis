// lib/hubspot/getCompanyById.ts
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { HubSpotContact } from "@/types/hubspot";
import { Company } from "@/types/company";

export async function getCompanyById(id: string): Promise<Company | null> {
  const companyProperties = [
    "name",
    "legal_business_name",
    "zip",
    "address",
    "city",
    "state",
    "county",
    "phone",
    "lead_status_l2",
  ].join(",");

  const res = await hubspotRequest(
    `/crm/v3/objects/companies/${id}?properties=${companyProperties}`,
    "GET"
  );

  if (!res?.id) return null;

  const assocRes = await hubspotRequest(
    `/crm/v4/objects/companies/${id}/associations/contacts`,
    "GET"
  );

  const contactIds = assocRes.results.map((r: any) => r.toObjectId);
  let contacts: HubSpotContact[] = [];

  if (contactIds.length > 0) {
    const contactBatchRes = await hubspotRequest(
      "/crm/v3/objects/contacts/batch/read",
      "POST",
      {
        properties: [
          "firstname",
          "lastname",
          "email",
          "address",
          "phone",
          "jobtitle",
        ],
        inputs: contactIds.map((id: string) => ({ id })),
      }
    );
    contacts = contactBatchRes.results;
  }

  return {
    id: res.id,
    name: res.properties.name,
    phone: res.properties.phone,
    lead_status_l2: res.properties.lead_status_l2,
    legal_business_name: res.properties.legal_business_name,
    zip: res.properties.zip,
    address: res.properties.address,
    city: res.properties.city,
    state: res.properties.state,
    county: res.properties.county,
    contacts,
  };
}
