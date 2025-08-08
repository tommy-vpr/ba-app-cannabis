import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getContactByIdWithCompanyAndMeetings(contactId: string) {
  // Step 1: Fetch contact properties
  const contactProperties = [
    "firstname",
    "lastname",
    "email",
    "phone",
    "address",
    "jobtitle",
  ].join(",");

  const contactRes = await hubspotRequest(
    `/crm/v4/objects/contacts/${contactId}?properties=${contactProperties}`,
    "GET"
  );

  if (!contactRes?.id) return null;

  const contact = {
    id: contactRes.id,
    firstname: contactRes.properties.firstname ?? "",
    lastname: contactRes.properties.lastname ?? "",
    jobtitle: contactRes.properties.jobtitle ?? "",
    email: contactRes.properties.email ?? "",
    phone: contactRes.properties.phone ?? "",
    address: contactRes.properties.address ?? "",
  };

  // Step 2: Fetch associated company (v4)
  const assocCompanyRes = await hubspotRequest(
    `/crm/v4/objects/contacts/${contactId}/associations/companies`,
    "GET"
  );

  let company = null;

  if (assocCompanyRes?.results?.length > 0) {
    const companyId = assocCompanyRes.results[0].toObjectId;

    const companyRes = await hubspotRequest(
      `/crm/v4/objects/companies/${companyId}?properties=legal_business_name,address,city,state,zip,phone,lead_status_l2`,
      "GET"
    );

    company = {
      id: companyRes.id,
      legal_business_name: companyRes.properties.legal_business_name ?? "",
      address: companyRes.properties.address ?? "",
      city: companyRes.properties.city ?? "",
      state: companyRes.properties.state ?? "",
      zip: companyRes.properties.zip ?? "",
      phone: companyRes.properties.phone ?? "",
      lead_status_l2: companyRes.properties.lead_status_l2 ?? "",
    };
  }

  // Step 3: Fetch associated meetings (v4)
  const assocMeetingsRes = await hubspotRequest(
    `/crm/v4/objects/contacts/${contactId}/associations/meetings`,
    "GET"
  );

  const meetingIds: string[] =
    assocMeetingsRes?.results?.map((r: any) => r.toObjectId) ?? [];

  let meetings: {
    id: string;
    title: string;
    notes?: string;
    createdAt: string;
  }[] = [];

  if (meetingIds.length > 0) {
    const meetingBatchRes = await hubspotRequest(
      `/crm/v4/objects/meetings/batch/read`,
      "POST",
      {
        properties: ["hs_title", "hs_body_preview", "hs_timestamp"],
        inputs: meetingIds.map((id) => ({ id })),
      }
    );

    meetings = meetingBatchRes.results.map((m: any) => ({
      id: m.id,
      title: `Meeting note with ${contact.firstname} ${contact.lastname}`,
      notes: m.properties.hs_body_preview ?? "",
      createdAt: m.properties.hs_timestamp ?? "",
    }));
  }

  return {
    contact: { ...contact },
    company,
    meetings,
  };
}
