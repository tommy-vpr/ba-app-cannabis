"use client";

import { Input } from "@/components/ui/input";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { useEffect, useRef, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchAndFilter() {
  const {
    selectedStatus,
    setSelectedStatus,
    setQuery,
    setSelectedZip,
    fetchPage,
    statusCounts,
    availableZips,
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
    const urlQuery = searchParams.get("query") || "";
    const urlStatus = (searchParams.get("status") as StatusKey) || "all";
    const urlZip = searchParams.get("zip") || "";

    setLocalQuery(urlQuery);
    setLocalZip(urlZip);
    setQuery(urlQuery);
    setSelectedZip(urlZip || null);
    setSelectedStatus(urlStatus);
  }, []);

  const updateSearchParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
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

  const handleSearch = async () => {
    setHasSearched(true);
    setQuery(localQuery);
    setSelectedZip(localZip || null);
    updateSearchParams({
      query: localQuery,
      zip: localZip || null,
      status: selectedStatus,
    });
    await fetchPage(1, selectedStatus, localQuery, undefined, localZip || null);
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
    assigned: "bg-transparent text-orange-400",
    visited: "bg-transparent text-red-400",
    "dropped off": "bg-transparent text-green-400",
  };

  const ringColors: Record<StatusKey, string> = {
    all: "ring-gray-400",
    assigned: "ring-orange-400",
    visited: "ring-red-400",
    "dropped off": "ring-green-400",
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        <div className="relative w-full">
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search company"
            className="w-full pr-10 bg-white"
          />
          {localQuery && (
            <button
              onClick={async () => {
                setLocalQuery("");
                setQuery("");
                setHasSearched(false); // reset
                updateSearchParams({ query: null });
                if (hasSearched) {
                  await fetchPage(
                    1,
                    selectedStatus,
                    "",
                    undefined,
                    localZip || null
                  );
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <IconX size={16} />
            </button>
          )}
        </div>

        <div className="relative w-[180px]">
          <Input
            value={localZip}
            onChange={(e) => setLocalZip(e.target.value)}
            placeholder="ZIP"
            className="w-full pr-10 bg-white"
          />
          {localZip && (
            <button
              onClick={async () => {
                setLocalZip("");
                setSelectedZip(null);
                setHasSearched(false); // reset
                updateSearchParams({ zip: null });
                if (hasSearched) {
                  await fetchPage(
                    1,
                    selectedStatus,
                    localQuery,
                    undefined,
                    null
                  );
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <IconX size={16} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center px-3 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
      <div className="flex items-center justify-end gap-3">
        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="cursor-pointer flex items-center gap-1 transition rounded-full hover:text-red-400"
          >
            <IconX size={14} className="bg-black text-white" />
            Clear filters
          </button>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="cursor-pointer flex items-center gap-1 text-md text-muted-foreground hover:opacity-80"
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
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {statusLabels[status]} ({count})
                    </button>
                  );
                })}
              </div>
              {/* ZIP Code Dropdown */}
              {/* <div className="relative w-[150px]">
                <select
                  value={localZip}
                  onChange={(e) => setLocalZip(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
               rounded px-3 py-2 text-sm pr-10 appearance-none"
                >
                  <option value="">All ZIPs</option>
                  {availableZips.map((zip) => (
                    <option key={zip} value={zip}>
                      {zip}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
