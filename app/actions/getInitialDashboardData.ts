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
