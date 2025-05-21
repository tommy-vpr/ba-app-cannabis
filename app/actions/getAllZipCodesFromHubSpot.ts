"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function getAllZipCodesFromHubSpot(
  brand: "litto-cannabis" | "skwezed"
) {
  const uniqueZips = new Set<string>();
  let after: string | null = null;

  while (true) {
    const body = {
      properties: ["zip"],
      limit: 100,
      after: after ?? undefined,
    };

    const res = await hubspotRequest(
      "/crm/v3/objects/contacts/search",
      "POST",
      brand,
      body
    );

    for (const contact of res.results || []) {
      const zip = contact.properties?.zip?.trim();
      if (zip && /^\d+$/.test(zip)) {
        uniqueZips.add(zip);
      }
    }

    after = res.paging?.next?.after ?? null;
    if (!after) break;
  }

  //   return Array.from(uniqueZips).sort((a, b) => parseInt(b) - parseInt(a));
  return Array.from(uniqueZips).sort((a, b) => a.localeCompare(b));
}

// export async function getAllZipCodesFromHubSpot(brand: "litto-cannabis" | "skwezed") {
//   const uniqueZips = new Set<string>();
//   let after: string | null = null;

//   while (true) {
//     const body = {
//       properties: ["zip"],
//       limit: 100,
//       after: after ?? undefined,
//     };

//     const res = await hubspotRequest(
//       "/crm/v3/objects/contacts/search",
//       "POST",
//       brand,
//       body
//     );

//     for (const contact of res.results || []) {
//       const zip = contact.properties?.zip?.trim();
//       if (zip && /^\d+$/.test(zip)) uniqueZips.add(zip); // ✅ only add numeric ZIPs
//     }

//     after = res.paging?.next?.after ?? null;
//     if (!after) break;
//   }

//   return Array.from(uniqueZips).sort((a, b) => {
//     const numA = parseInt(a, 10);
//     const numB = parseInt(b, 10);

//     // fallback to string compare if parse fails (e.g. alphanumeric ZIPs)
//     if (isNaN(numA) || isNaN(numB)) return b.localeCompare(a);

//     return numB - numA;
//   });
// }
