// app/actions/getSavedContacts.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getSavedContactIds(): Promise<string[]> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return [];

  const saved = await prisma.savedContact.findMany({
    where: { userId },
    select: { contactId: true },
  });

  return saved.map((s) => s.contactId);
}
