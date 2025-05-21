// app/api/contacts/visit-requested/route.ts
import { NextResponse } from "next/server";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function GET() {
  try {
    const { baseUrl, token } = getHubspotCredentials("litto-cannabis");

    const filters = [
      {
        propertyName: "l2_lead_status",
        operator: "EQ",
        value: "visit requested by rep", // ✅ exact lowercase match required
      },
    ];

    const body = {
      filterGroups: [{ filters }],
      sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
      properties: [
        "firstname",
        "lastname",
        "email",
        "company",
        "zip",
        "address",
        "hs_lead_status",
        "l2_lead_status",
      ],
      limit: 100,
    };

    const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      next: {
        revalidate: 30, // optional caching for 30s
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ contacts: data.results ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
