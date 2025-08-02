"use client";

import { Input } from "@/app/components/ui/input";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StatusKey, statusList, statusLabels } from "@/types/status";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="w-full flex flex-col gap-2 px-2 md:px-0">
      <div className="flex gap-2 w-full md:w-2/3 mx-auto">
        <div className="relative w-full">
          <Input
            placeholder="Search Store"
            className="w-full pr-10 bg-white shadow-none"
          />
        </div>
        <div className="flex items-center text-gray-400 dark:text-gray-100/20">
          or
        </div>
        <div className="relative max-w-[180px]">
          <Input
            placeholder="ZIP"
            className="w-full pr-10 bg-white shadow-none"
          />
        </div>

        <button
          className="flex items-center justify-center px-1 md:px-3 text-gray-400 dark:text-gray-100/60"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
