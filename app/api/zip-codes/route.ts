// /app/api/zip-codes/page/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Update path if needed

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const after = searchParams.get("after");
  const brand = (searchParams.get("brand") ?? "litto-cannabis") as
    | "litto-cannabis"
    | "skwezed";

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ zips: [], after: null }, { status: 401 });
  }

  const uniqueZips = new Set<string>();

  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "ba_email",
            operator: "EQ",
            value: userEmail.toLowerCase().trim(),
          },
        ],
      },
    ],
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    properties: ["zip"],
    limit: 50,
    after: after || undefined,
  };

  const res = await hubspotRequest(
    "/crm/v3/objects/contacts/search",
    "POST",
    brand,
    body
  );

  for (const contact of res.results || []) {
    const zip = contact.properties?.zip?.trim();
    if (zip) uniqueZips.add(zip);
  }

  return NextResponse.json({
    zips: Array.from(uniqueZips),
    after: res.paging?.next?.after ?? null,
  });
}

// // app/api/zip-codes/page/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getPaginatedZipCodesFromHubSpot } from "@/app/actions/getPaginatedZipCodesFromHubSpot";

// export async function GET(req: NextRequest) {
//   const brand = (req.nextUrl.searchParams.get("brand") || "litto-cannabis") as
//     | "litto-cannabis"
//     | "skwezed";
//   const after = req.nextUrl.searchParams.get("after") || undefined;

//   const result = await getPaginatedZipCodesFromHubSpot(brand, after);

//   return NextResponse.json(result);
// }
