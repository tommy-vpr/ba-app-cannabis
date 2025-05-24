"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function saveContact(hubspotContactId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  // Get current max position
  const maxPositionEntry = await prisma.savedContact.findFirst({
    where: { userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const newPosition = maxPositionEntry ? maxPositionEntry.position + 1 : 0;

  const saved = await prisma.savedContact.create({
    data: {
      userId,
      contactId: hubspotContactId,
      position: newPosition,
    },
  });

  return saved;
}
