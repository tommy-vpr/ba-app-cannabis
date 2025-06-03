import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ zip: string }> }
) {
  const { zip } = await context.params;

  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const body = {
    filterGroups: [
      {
        filters: [{ propertyName: "zip", operator: "EQ", value: zip }],
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
      "lead_status_l2",
      "meeting_logs",
    ],
    limit: 100,
  };

  try {
    const data = await hubspotRequest(
      "/crm/v3/objects/contacts/search",
      "POST",
      brand,
      body
    );

    return NextResponse.json({ contacts: data.results ?? [] });
  } catch (err: any) {
    console.error("Failed to fetch ZIP contacts:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
