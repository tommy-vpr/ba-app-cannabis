// app/actions/getInitialDashboardData.ts
"use server";

import { getContacts } from "./getContacts";
import { getStatusCounts } from "./getStatusCounts";

export async function getInitialDashboardData(
  brand: "litto-cannabis" | "skwezed",
  email: string
) {
  const [contactsResult, statusCounts] = await Promise.all([
    getContacts({ page: 1 }, brand, email),
    getStatusCounts(brand, email),
  ]);

  console.log("Server: ", email);

  return {
    ...contactsResult, // contacts, after, hasNext
    statusCounts,
  };
}
