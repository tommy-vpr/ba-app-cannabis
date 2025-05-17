// // app/actions/getInitialDashboardData.ts
// "use server";

// import { getContacts } from "./getContacts";
// import { getStatusCounts } from "./getStatusCounts";
// import { cookies } from "next/headers";

// export async function getInitialDashboardData() {
//   const cookieStore = await cookies();
//   const selectedBrand =
//     (cookieStore.get("selected_brand")?.value as "litto" | "skwezed") ??
//     "litto";

//   const [contactsResult, statusCounts] = await Promise.all([
//     getContacts({ page: 1 }, selectedBrand),
//     getStatusCounts(selectedBrand),
//   ]);

//   return {
//     ...contactsResult,
//     statusCounts,
//   };
// }

// app/actions/getInitialDashboardData.ts
"use server";

import { getContacts } from "./getContacts";
import { getStatusCounts } from "./getStatusCounts";

export async function getInitialDashboardData(brand: "litto" | "skwezed") {
  const [contactsResult, statusCounts] = await Promise.all([
    getContacts({ page: 1 }, brand),
    getStatusCounts(brand),
  ]);

  return {
    ...contactsResult, // contacts, after, hasNext
    statusCounts,
  };
}
