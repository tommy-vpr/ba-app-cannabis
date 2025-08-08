// lib/hubspot/getCannabisCompaniesPaginated.ts
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { Company } from "@/types/company";

type PaginatedResult = {
  companies: Company[];
  nextCursor: string | null;
};

export async function getCannabisCompaniesPaginated(
  limit = 4,
  after?: string,
  userEmail?: string // pass session.user.email here
): Promise<PaginatedResult> {
  if (!userEmail) {
    throw new Error("User email required to filter by ba_email.");
  }

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
            {
              propertyName: "ba_email", // assumes this custom property exists in HubSpot
              operator: "EQ",
              value: userEmail,
            },
          ],
        },
      ],
      properties: [
        "name",
        "phone",
        "legal_business_name",
        "zip",
        "address",
        "city",
        "state",
        "county",
        "lead_status_l2",
        "ba_email", // optional: include for debug/confirmation
      ],
      limit,
      after,
    }
  );

  const companies = companiesRes.results.map((company: any) => ({
    id: company.id,
    name: company.properties.name,
    phone: company.properties.phone,
    lead_status_l2: company.properties.lead_status_l2,
    legal_business_name: company.properties.legal_business_name,
    city: company.properties.city,
    state: company.properties.state,
    address: company.properties.address,
    zip: company.properties.zip,
    county: company.properties.county,
    contacts: [], // can be filled later via `/crm/v3/objects/contacts/search` + association
  }));

  return {
    companies,
    nextCursor: companiesRes.paging?.next?.after ?? null,
  };
}
