// app/actions/toggleBookmark.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function toggleBookmark(companyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { bookmarks: true },
  });

  const isBookmarked = user?.bookmarks.some((c: any) => c.id === companyId);

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      bookmarks: isBookmarked
        ? { disconnect: { id: companyId } }
        : { connect: { id: companyId } },
    },
  });
}
