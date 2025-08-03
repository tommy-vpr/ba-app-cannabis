// lib/hubspot/getCannabisCompaniesPaginated.ts
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { Company } from "@/types/company";
import { HubSpotContact } from "@/types/hubspot";

type PaginatedResult = {
  companies: Company[];
  nextCursor: string | null;
};

export async function getCannabisCompaniesPaginated(
  limit = 4,
  after?: string
): Promise<PaginatedResult> {
  const companiesRes = await hubspotRequest(
    "/crm/v3/objects/companies/search",
    "POST",
    {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "industry",
              operator: "EQ",
              value: "Cannabis",
            },
          ],
        },
      ],
      properties: [
        "name",
        "legal_business_name",
        "zip",
        "address",
        "city",
        "state",
        "county",
      ],
      limit,
      after,
    }
  );

  const companies = companiesRes.results;
  const enrichedCompanies: Company[] = [];

  const allContactIdMap = new Map<string, string>(); // contactId -> companyId

  for (const company of companies) {
    const assocRes = await hubspotRequest(
      `/crm/v4/objects/companies/${company.id}/associations/contacts`,
      "GET"
    );

    for (const assoc of assocRes.results) {
      allContactIdMap.set(assoc.toObjectId, company.id);
    }

    enrichedCompanies.push({
      id: company.id,
      name: company.properties.name,
      legal_business_name: company.properties.legal_business_name,
      city: company.properties.city,
      state: company.properties.state,
      address: company.properties.address,
      zip: company.properties.zip,
      county: company.properties.county,
      contacts: [],
    });
  }

  const contactIds = Array.from(allContactIdMap.keys());

  if (contactIds.length > 0) {
    const contactBatchRes = await hubspotRequest(
      "/crm/v3/objects/contacts/batch/read",
      "POST",
      {
        properties: ["firstname", "lastname", "email"],
        inputs: contactIds.map((id) => ({ id })),
      }
    );

    for (const contact of contactBatchRes.results) {
      const companyId = allContactIdMap.get(contact.id);
      const company = enrichedCompanies.find((c) => c.id === companyId);
      if (company) {
        company.contacts.push(contact as HubSpotContact);
      }
    }
  }

  return {
    companies: enrichedCompanies,
    nextCursor: companiesRes.paging?.next?.after ?? null,
  };
}
