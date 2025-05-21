import { NextRequest, NextResponse } from "next/server";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { zip: string } }
) {
  const zip = params.zip;

  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "zip",
            operator: "EQ",
            value: zip,
          },
        ],
      },
    ],
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    properties: [
      "firstname",
      "lastname",
      "jobtitle",
      "email",
      "phone",
      "company",
      "city",
      "state",
      "zip",
      "address",
      "hs_lead_status",
      "l2_lead_status",
      "meeting_logs",
    ],
    limit: 100, // Optional: you can add pagination with `after` if needed
  };

  try {
    const data = await hubspotRequest(
      "/crm/v3/objects/contacts/search",
      "POST",
      brand,
      body
    );

    return NextResponse.json({ contacts: data.results ?? [] });
  } catch (error: any) {
    console.error("Error fetching contacts by ZIP:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
