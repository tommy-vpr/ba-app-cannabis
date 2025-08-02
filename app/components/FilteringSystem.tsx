"use client";

import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function FilteringSystem() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [localQuery, setLocalQuery] = useState("");
  // const [localZip, setLocalZip] = useState("");

  const [showFilters, setShowFilters] = useState(true); // Toggle state

  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-end gap-3">
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
                  return (
                    <button
                      key={status}
                      className={`px-3 py-1 rounded-full text-sm transition cursor-pointer`}
                    ></button>
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
