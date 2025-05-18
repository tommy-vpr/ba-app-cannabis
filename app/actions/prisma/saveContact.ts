// app/actions/saveContact.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function saveContact(hubspotContactId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const saved = await prisma.savedContact.create({
    data: { userId, contactId: hubspotContactId },
  });

  return saved;
}
