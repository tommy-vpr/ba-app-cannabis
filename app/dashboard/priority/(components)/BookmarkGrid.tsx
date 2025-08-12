// app/dashboard/bookmarks/BookmarkGrid.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { PiSeal, PiSealCheckFill } from "react-icons/pi";
import { LeadStatusBadge } from "@/app/components/LeadStatusBadge";
import { LeadStatus } from "@/types/company";
import { useCannabisCompanies } from "@/context/CompanyContext"; // ⬅️ Hook from your provider

export default function BookmarkGrid() {
  const { companies, toggleBookmark, pendingId } = useCannabisCompanies();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Filter provider state to only bookmarked items
  const items = companies.filter((c) => c.isBookmarked);

  if (items.length === 0) {
    return <p className="text-gray-500">No bookmarks yet.</p>;
  }

  const toCompanyPath = (companyId: string) => {
    return `/dashboard/companies/${companyId}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((b) => (
        <div
          key={b.id}
          onClick={() => router.push(toCompanyPath(b.id))}
          className="group cursor-pointer hover:-translate-y-0.5 duration-150 relative p-4 rounded-md shadow-md shadow-gray-200 
                     dark:shadow-black/30 hover:shadow-lg transition h-full flex flex-col gap-2 bg-white dark:bg-[#161b22] dark:border dark:border-[#30363d]"
        >
          {/* Bookmark toggle button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startTransition(() => toggleBookmark(b.id));
            }}
            disabled={pendingId === b.id || isPending}
            className="cursor-pointer absolute top-2 right-2 text-yellow-400 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={b.isBookmarked ? "Unbookmark" : "Bookmark"}
            title={b.isBookmarked ? "Remove from Priority" : "Add to Priority"}
          >
            {pendingId === b.id ? (
              <PiSeal size={20} />
            ) : b.isBookmarked ? (
              <PiSealCheckFill size={20} />
            ) : (
              <PiSeal size={20} />
            )}
          </button>

          {/* Title */}
          <h2 className="text-md mb-2 font-bold text-zinc-600 dark:text-gray-200">
            {b.legal_business_name || b.name || b.id}
          </h2>

          {/* Location */}
          <p className="text-xs text-gray-400 flex items-baseline gap-1">
            <MapPin size={14} />
            <span>
              {b.city}
              {b.city && (b.state || b.zip) ? ", " : ""}
              {b.state} {b.zip}
            </span>
          </p>

          {/* Lead Status Badge */}
          <LeadStatusBadge status={b.lead_status_l2 as LeadStatus} />
        </div>
      ))}
    </div>
  );
}
