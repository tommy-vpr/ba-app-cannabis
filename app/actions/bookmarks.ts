// app/actions/bookmarks.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getBookmarkedCompanyIds(): Promise<string[]> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return [];

  const rows = await prisma.bookmark.findMany({
    where: { userId },
    select: { companyId: true },
  });
  return rows.map((r) => r.companyId);
}

export async function toggleCompanyBookmark(
  companyId: string,
  snapshot?: {
    legal_business_name?: string;
    name?: string;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    lead_status_l2?: string | null;
  }
): Promise<{ bookmarked: boolean }> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.bookmark.findFirst({
    where: { userId, companyId },
    select: { id: true },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({
    data: {
      userId,
      companyId,
      companyName: snapshot?.legal_business_name ?? snapshot?.name ?? "",
      companyCity: snapshot?.city ?? null,
      companyState: snapshot?.state ?? null,
      companyZip: snapshot?.zip ?? null,
      companyStatus: snapshot?.lead_status_l2 ?? null,
    },
  });

  return { bookmarked: true };
}
