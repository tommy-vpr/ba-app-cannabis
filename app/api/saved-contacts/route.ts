// app/api/saved-contacts/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ savedIds: [] });

  const saved = await prisma.savedContact.findMany({
    where: { userId: session.user.id },
    select: { contactId: true },
  });

  return NextResponse.json({ savedIds: saved.map((s) => s.contactId) });
}
