"use client";

import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { useEffect, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchbarFiltering() {
  const {
    selectedStatus,
    setSelectedStatus,
    setQuery,
    setSelectedZip,
    fetchPage,
    statusCounts,
    localQuery,
    setLocalQuery,
    localZip,
    setLocalZip,
  } = useContactContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(true); // Toggle state

  const hasFilters =
    localQuery.trim() !== "" ||
    localZip.trim() !== "" ||
    selectedStatus !== "all";

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const urlQuery = searchParams.get("query");
    const urlStatus = searchParams.get("status") as StatusKey;
    const urlZip = searchParams.get("zip");

    if (urlQuery !== null) {
      setLocalQuery(urlQuery);
      setQuery(urlQuery);
    }

    if (urlZip !== null) {
      setLocalZip(urlZip);
      setSelectedZip(urlZip);
    }

    if (urlStatus !== null) {
      setSelectedStatus(urlStatus);
    }
  }, []);

  const updateSearchParams = (newParams: Record<string, string | null>) => {
    // const params = new URLSearchParams(searchParams.toString());
    const params = new URLSearchParams(); // start fresh
    for (const key in newParams) {
      const value = newParams[key];
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusClick = async (status: StatusKey) => {
    setHasSearched(false);
    setSelectedStatus(status);
    updateSearchParams({
      status,
      query: localQuery || null,
      zip: localZip || null,
    });
    await fetchPage(1, status, localQuery, undefined, localZip || null);
  };

  const handleClearAll = async () => {
    setLocalQuery("");
    setLocalZip("");
    setQuery("");
    setSelectedZip(null);
    setSelectedStatus("all");
    setHasSearched(false);

    updateSearchParams({
      status: "all",
      query: null,
      zip: null,
    });

    await fetchPage(1, "all", "", undefined, null);
  };

  const statusStyles: Record<StatusKey, string> = {
    all: `bg-transparent text-gray-700 dark:text-gray-300`,
    Assigned: "bg-transparent text-blue-400",
    Visited: "bg-transparent text-rose-400",
    "Dropped Off": "bg-transparent text-green-400",
    "Not Started": "bg-transparent text-blue-400",
  };

  const ringColors: Record<StatusKey, string> = {
    all: "ring-gray-400",
    Assigned: "ring-blue-400",
    Visited: "ring-rose-400",
    "Dropped Off": "ring-green-400",
    "Not Started": "ring-blue-300",
  };

  return (
    <div className="w-full ">
      <div className="flex flex-col-reverse sm:flex-row justify-center p-2 border-b-1 dark:border-b-[#30363d] bg-white dark:bg-[#0d1117] xl:flex-row xl:items-center gap-4 xl:gap-2 w-full md:justify-center">
        <div className="flex flex-wrap gap-1 md:gap-2">
          {statusList
            .filter((status) => status !== "Assigned")
            .map((status) => {
              const isActive = selectedStatus === status;
              const count = statusCounts[status];
              return (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  className={`px-3 py-1 rounded-full text-xs md:text-sm transition cursor-pointer ${
                    statusStyles[status]
                  } ${
                    isActive
                      ? `ring-1 ${ringColors[status]} ring-offset-white dark:ring-offset-[#1a1a1a]`
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {statusLabels[status]} ({count})
                </button>
              );
            })}
        </div>
        <div className="flex items-center justify-end gap-3">
          {hasFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm cursor-pointer flex items-center gap-1 transition rounded-full hover:opacity-80 text-rose-400 whitespace-nowrap"
            >
              <IconX
                size={14}
                className="text-white bg-rose-400 dark:text-black"
              />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
