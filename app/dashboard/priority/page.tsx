// app/dashboard/bookmarks/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BookmarkGrid from "./(components)/BookmarkGrid";

import { getBookmarksWithLiveStatus } from "@/app/actions/getBookmarksWithLiveStatus";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const bookmarksRaw = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const bookmarks = bookmarksRaw.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  const initial = await getBookmarksWithLiveStatus();

  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto">
      <h1 className="text-blue-500 text-xl font-semibold mb-4">
        Priority Companies
      </h1>

      <BookmarkGrid />
    </div>
  );
}
