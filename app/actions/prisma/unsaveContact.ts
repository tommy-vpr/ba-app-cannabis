// app/actions/unsaveContact.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function unsaveContact(hubspotContactId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  await prisma.savedContact.delete({
    where: {
      userId_contactId: { userId, contactId: hubspotContactId },
    },
  });
}
