// app/api/hubspot/bookmarks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId, snapshot } = await req.json();
  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const existing = await prisma.bookmark.findFirst({
    where: { userId: session.user.id, companyId },
    select: { id: true },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  const created = await prisma.bookmark.create({
    data: {
      userId: session.user.id,
      companyId,
      companyName: snapshot?.legal_business_name ?? snapshot?.name ?? "",
      companyCity: snapshot?.city ?? null,
      companyState: snapshot?.state ?? null,
      companyZip: snapshot?.zip ?? null,
    },
  });

  return NextResponse.json({ bookmarked: true, bookmarkId: created.id });
}
