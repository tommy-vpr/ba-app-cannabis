// app/actions/fetchCompaniesByUser.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getCannabisCompaniesPaginated } from "./getCannabisCompaniesPaginated";

export async function fetchCompaniesByUser(limit: number = 12, after?: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  return getCannabisCompaniesPaginated(limit, after, email);
}
