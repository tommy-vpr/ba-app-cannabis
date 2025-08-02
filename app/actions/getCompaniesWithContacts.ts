import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getCannabisCompaniesWithContacts() {
  // Step 1: Filter companies where industry = Cannabis
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
      limit: 4,
    }
  );

  const companies = companiesRes.results;

  // Step 2: Fetch associated contacts
  const enrichedCompanies = await Promise.all(
    companies.map(async (company: any) => {
      const companyId = company.id;

      const assocRes = await hubspotRequest(
        `/crm/v4/objects/companies/${companyId}/associations/contacts`,
        "GET"
      );

      const contactIds = assocRes.results.map((a: any) => a.toObjectId);

      const contacts = await Promise.all(
        contactIds.map((id: string) =>
          hubspotRequest(
            `/crm/v3/objects/contacts/${id}?properties=firstname,lastname,email`,
            "GET"
          )
        )
      );

      return {
        id: companyId,
        name: company.properties.name,
        legal_business_name: company.properties.legal_business_name,
        city: company.properties.city,
        state: company.properties.state,
        address: company.properties.address,
        zip: company.properties.zip,
        county: company.properties.county,
        contacts,
      };
    })
  );

  return enrichedCompanies;
}
