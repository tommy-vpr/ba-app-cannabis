// app/dashboard/bookmarks/BookmarkGrid.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookmarkCheck, Bookmark, MapPin } from "lucide-react";
import { toggleCompanyBookmark } from "@/app/actions/bookmarks";
import { LeadStatusBadge } from "@/app/components/LeadStatusBadge";
import { LeadStatus } from "@/types/company";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { PiSeal, PiSealCheckFill } from "react-icons/pi";

type BookmarkRow = {
  id: string;
  userId: string;
  companyId: string;
  companyName: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyZip: string | null;
  companyStatus: string | null; // ✅ add this
  createdAt: string;
};

export default function BookmarkGrid({ initial }: { initial: BookmarkRow[] }) {
  const [items, setItems] = useState(
    initial.map((b) => ({ ...b, isBookmarked: true as boolean }))
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  console.log("STATUS?", items);

  const onToggle = async (companyId: string) => {
    if (pendingId) return;
    setPendingId(companyId);

    // optimistic flip/remove (remove from list when unbookmarked)
    setItems(
      (prev) =>
        prev
          .map((b) =>
            b.companyId === companyId
              ? { ...b, isBookmarked: !b.isBookmarked }
              : b
          )
          .filter((b) => b.isBookmarked) // remove if now unbookmarked
    );

    try {
      await toggleCompanyBookmark(companyId);
      startTransition(() => router.refresh());
    } catch {
      // rollback by reloading (simplest/most consistent with server)
      startTransition(() => router.refresh());
    } finally {
      setPendingId(null);
    }
  };

  if (items.length === 0) {
    return <p className="text-gray-500">No bookmarks yet.</p>;
  }

  const toCompanyPath = (companyId: string) => {
    // Navigate to the same base as your list cards do
    // If you're at /dashboard/bookmarks, strip /bookmarks and go to /dashboard/companies/[id]
    // const base = pathname.replace(/\/bookmarks\/?$/, "");
    return `/dashboard/companies/${companyId}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((b) => (
        <div
          key={b.id}
          onClick={() => router.push(toCompanyPath(b.companyId))}
          className="group cursor-pointer hover:-translate-y-0.5 duration-150 relative p-4 rounded-md shadow-md shadow-gray-200 
                     dark:shadow-black/30 hover:shadow-lg transition h-full flex flex-col gap-2 bg-white dark:bg-[#161b22] dark:border dark:border-[#30363d]"
        >
          {/* Bookmark toggle button (same corner behavior + stopPropagation) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(b.companyId);
            }}
            disabled={pendingId === b.companyId || isPending}
            className="cursor-pointer absolute top-2 right-2 text-yellow-400 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={b.isBookmarked ? "Unbookmark" : "Bookmark"}
            title={b.isBookmarked ? "Remove from Priority" : "Add to Priority"}
          >
            {pendingId === b.companyId ? (
              <PiSeal size={20} />
            ) : b.isBookmarked ? (
              <PiSealCheckFill size={20} />
            ) : (
              <PiSeal size={20} />
            )}
          </button>

          {/* Title — match list style */}
          <h2 className="text-md mb-2 font-bold text-zinc-600 dark:text-gray-200">
            {b.companyName || b.companyId}
          </h2>

          {/* Location row — match list style */}
          <p className="text-xs text-gray-400 flex items-baseline gap-1">
            <MapPin size={14} />
            <span>
              {b.companyCity}
              {b.companyCity && (b.companyState || b.companyZip) ? ", " : ""}
              {b.companyState} {b.companyZip}
            </span>
          </p>

          {/* If you later store lead_status_l2 in bookmarks, you can render the badge here to fully mirror the list */}
          <LeadStatusBadge status={b.companyStatus as LeadStatus} />
        </div>
      ))}
    </div>
  );
}
