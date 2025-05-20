"use client";

import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { useEffect, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteringSystem() {
  const {
    selectedStatus,
    setSelectedStatus,
    setQuery,
    setSelectedZip,
    fetchPage,
    statusCounts,
  } = useContactContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [localQuery, setLocalQuery] = useState("");
  // const [localZip, setLocalZip] = useState("");
  const { localQuery, setLocalQuery, localZip, setLocalZip } =
    useContactContext();
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
    assigned: "bg-transparent text-blue-500",
    visited: "bg-transparent text-purple-400",
    "dropped off": "bg-transparent text-green-400",
  };

  const ringColors: Record<StatusKey, string> = {
    all: "ring-gray-400",
    assigned: "ring-blue-500",
    visited: "ring-purple-400",
    "dropped off": "ring-green-400",
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-end gap-3">
        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm cursor-pointer flex items-center gap-1 transition rounded-full hover:opacity-80 text-rose-400"
          >
            <IconX
              size={14}
              className="text-white bg-rose-400 dark:text-black"
            />
            Clear filters
          </button>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer flex items-center gap-1 text-md text-[#4493f8] hover:opacity-80"
        >
          Filters <IconAdjustmentsHorizontal size={19} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col p-1 xl:flex-row xl:items-center gap-4 xl:gap-2 w-full md:justify-between">
              <div className="flex flex-wrap gap-2">
                {statusList.map((status) => {
                  const isActive = selectedStatus === status;
                  const count = statusCounts[status];
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusClick(status)}
                      className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                        statusStyles[status]
                      } ${
                        isActive
                          ? `ring-1 ${ringColors[status]} ring-offset-white dark:ring-offset-[#1a1a1a]`
                          : "opacity-100 hover:opacity-80"
                      }`}
                    >
                      {statusLabels[status]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
