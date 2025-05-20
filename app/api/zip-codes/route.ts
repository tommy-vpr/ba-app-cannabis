// /app/api/zip-codes/page/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const after = searchParams.get("after");
  const brand = (searchParams.get("brand") ?? "litto") as "litto" | "skwezed";

  const uniqueZips = new Set<string>();

  const body = {
    properties: ["zip"],
    limit: 100,
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
//   const brand = (req.nextUrl.searchParams.get("brand") || "litto") as
//     | "litto"
//     | "skwezed";
//   const after = req.nextUrl.searchParams.get("after") || undefined;

//   const result = await getPaginatedZipCodesFromHubSpot(brand, after);

//   return NextResponse.json(result);
// }
