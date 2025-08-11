// lib/hubspot/getCannabisCompaniesPaginated.ts
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { Company } from "@/types/company";

type PaginatedResult = {
  companies: Company[];
  nextCursor: string | null;
};

export type LeadStatusFilter =
  | "All"
  | "Visited"
  | "Dropped Off"
  | "Not Started";

export async function getCannabisCompaniesPaginated(
  limit = 12,
  after?: string,
  userEmail?: string,
  statusFilter: LeadStatusFilter = "All",
  zip?: string // <-- NEW
): Promise<PaginatedResult> {
  if (!userEmail) throw new Error("User email required to filter by ba_email.");

  const pageSize = Math.min(Math.max(limit, 1), 100);

  // Base AND filters
  const baseFilters: any[] = [
    { propertyName: "industry", operator: "EQ", value: "Cannabis" },
    { propertyName: "ba_email", operator: "EQ", value: userEmail },
  ];

  if (zip && zip.trim()) {
    // Adjust propertyName if your portal uses a different field for ZIP
    baseFilters.push({
      propertyName: "zip",
      operator: "EQ",
      value: zip.trim(),
    });
  }

  // filterGroups: AND within group, OR across groups
  const filterGroups: Array<{ filters: any[] }> = [];

  if (statusFilter === "All") {
    filterGroups.push({ filters: baseFilters });
  } else if (statusFilter === "Not Started") {
    // null/missing in HubSpot
    filterGroups.push({
      filters: [
        ...baseFilters,
        { propertyName: "lead_status_l2", operator: "NOT_HAS_PROPERTY" },
      ],
    });
  } else {
    // "Visited" | "Dropped Off"
    filterGroups.push({
      filters: [
        ...baseFilters,
        { propertyName: "lead_status_l2", operator: "EQ", value: statusFilter },
      ],
    });
  }

  let companiesRes: any;
  try {
    companiesRes = await hubspotRequest(
      "/crm/v3/objects/companies/search",
      "POST",
      {
        filterGroups,
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
          "ba_email",
        ],
        // sorts: [{ propertyName: "name", direction: "ASCENDING" }], // optional
        limit: pageSize,
        after,
      }
    );
  } catch (e: any) {
    const msg = e?.response?.data
      ? `HubSpot error: ${e.response.status} ${JSON.stringify(e.response.data)}`
      : String(e);
    throw new Error(msg);
  }

  const companies: Company[] = (companiesRes.results ?? []).map(
    (company: any) => ({
      id: company.id,
      name: company.properties?.name ?? "",
      phone: company.properties?.phone ?? "",
      lead_status_l2: company.properties?.lead_status_l2 ?? null, // null = Not Started
      legal_business_name: company.properties?.legal_business_name ?? "",
      city: company.properties?.city ?? "",
      state: company.properties?.state ?? "",
      address: company.properties?.address ?? "",
      zip: company.properties?.zip ?? "",
      county: company.properties?.county ?? "",
      contacts: [],
    })
  );

  return {
    companies,
    nextCursor: companiesRes.paging?.next?.after ?? null,
  };
}
