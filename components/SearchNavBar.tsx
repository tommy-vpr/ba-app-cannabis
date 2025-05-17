"use client";

import { Input } from "@/components/ui/input";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { useEffect, useRef, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchNavBar() {
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

  const { localQuery, setLocalQuery, localZip, setLocalZip } =
    useContactContext();

  const [hasSearched, setHasSearched] = useState(false);

  // useEffect(() => {
  //   const urlQuery = searchParams.get("query") || "";
  //   const urlStatus = (searchParams.get("status") as StatusKey) || "all";
  //   const urlZip = searchParams.get("zip") || "";

  //   setLocalQuery(urlQuery);
  //   setLocalZip(urlZip);
  //   setQuery(urlQuery);
  //   setSelectedZip(urlZip || null);
  //   setSelectedStatus(urlStatus);
  // }, []);
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    const urlStatus = searchParams.get("status") as StatusKey;
    const urlZip = searchParams.get("zip");

    // Guard: only sync if URL actually has values
    if (urlQuery !== null) {
      setQuery(urlQuery);
      setLocalQuery(urlQuery);
    }

    if (urlZip !== null) {
      setSelectedZip(urlZip);
      setLocalZip(urlZip);
    }

    if (urlStatus !== null) {
      setSelectedStatus(urlStatus);
    }
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
    // router.push(`${pathname}?${params.toString()}`);
    router.push(`/dashboard?${params.toString()}`); // <-- force dashboard route
  };

  const handleSearch = async () => {
    console.log(
      "handleSearch triggered with:",
      localQuery,
      localZip,
      selectedStatus
    );
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
    "pending visit": "bg-transparent text-orange-400",
    "visit requested by rep": "bg-transparent text-red-400",
    "dropped off": "bg-transparent text-green-400",
  };

  const ringColors: Record<StatusKey, string> = {
    all: "ring-gray-400",
    "pending visit": "ring-orange-400",
    "visit requested by rep": "ring-red-400",
    "dropped off": "ring-green-400",
  };

  return (
    <div className="w-full flex flex-col gap-2 px-2 md:px-0">
      <div className="flex gap-2 w-full md:w-2/3 mx-auto">
        <div className="relative w-full">
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search company"
            className="w-full pr-10 bg-white shadow-none"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            >
              <IconX size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center text-gray-400 dark:text-gray-100/20">
          or
        </div>
        <div className="relative max-w-[180px]">
          <Input
            value={localZip}
            onChange={(e) => setLocalZip(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="ZIP"
            className="w-full pr-10 bg-white shadow-none"
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
          className="flex items-center justify-center px-1 md:px-3 text-gray-400 dark:text-gray-100/60"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
