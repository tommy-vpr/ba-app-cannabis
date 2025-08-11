// app/actions/getBookmarksWithLiveStatus.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

type BookmarkRow = {
  id: string;
  userId: string;
  companyId: string;
  companyName: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyZip: string | null;
  companyStatus: string | null;
  createdAt: string;
};

export async function getBookmarksWithLiveStatus(): Promise<BookmarkRow[]> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return [];

  // 1) Read bookmarks from Prisma
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (rows.length === 0) return [];

  // 2) Batch read companies from HubSpot for latest properties
  const inputs = rows.map((r) => ({ id: r.companyId }));
  let batchRes: any = null;
  try {
    batchRes = await hubspotRequest(
      "/crm/v3/objects/companies/batch/read",
      "POST",
      {
        properties: [
          "legal_business_name",
          "name",
          "city",
          "state",
          "zip",
          "lead_status_l2",
        ],
        inputs,
      }
    );
  } catch (e: any) {
    // If HubSpot fails, fall back to snapshots
    batchRes = { results: [] };
  }

  const byId = new Map<string, any>();
  for (const c of batchRes?.results ?? []) byId.set(c.id, c);

  // 3) Merge live props into the bookmark rows
  const merged: BookmarkRow[] = rows.map((r) => {
    const live = byId.get(r.companyId);
    const p = live?.properties ?? {};
    return {
      id: r.id,
      userId: r.userId,
      companyId: r.companyId,
      companyName:
        p.legal_business_name ?? p.name ?? r.companyName ?? r.companyId,
      companyCity: (p.city as string) ?? r.companyCity,
      companyState: (p.state as string) ?? r.companyState,
      companyZip: (p.zip as string) ?? r.companyZip,
      companyStatus: (p.lead_status_l2 as string) ?? r.companyStatus, // ← live status
      createdAt: r.createdAt.toISOString(),
    };
  });

  return merged;
}
