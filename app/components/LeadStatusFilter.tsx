"use client";

import { useCannabisCompanies } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";

type LeadStatusFilter = "All" | "Visited" | "Dropped Off" | "Not Started";

const STATUS_COLORS: Record<Exclude<LeadStatusFilter, "All">, string> = {
  Visited: "text-pink-400",
  "Dropped Off": "text-green-400",
  "Not Started": "text-blue-400",
};

const STATUSES = ["All", "Visited", "Dropped Off", "Not Started"] as const;

export function LeadStatusFilter() {
  const { statusFilter, setStatusFilter } = useCannabisCompanies();

  return (
    <div className="flex gap-2 justify-center p-2 border-b bg-white dark:bg-[#0d1117]">
      {STATUSES.map((status) => {
        const isActive = statusFilter === status;

        // text color per status
        const textColor =
          status === "All"
            ? "text-zinc-600 dark:text-zinc-300"
            : STATUS_COLORS[status as Exclude<LeadStatusFilter, "All">];

        return (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "cursor-pointer px-4 py-[2px] rounded-full text-xs md:text-sm transition",
              "bg-transparent", // never fill
              "border", // have a border width
              isActive ? "border-[currentColor]" : "border-transparent", // show border only when active, and match text color
              textColor,
              "hover:border-[currentColor]/40" // nice subtle hover
            )}
            aria-pressed={isActive}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
