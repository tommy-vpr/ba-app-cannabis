// lib/utils/clearFiltersAndRedirect.ts
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { startTransition } from "react";

export function useClearFiltersAndRedirect() {
  const router = useRouter();
  const {
    setQuery,
    setSelectedZip,
    setSelectedStatus,
    setLocalQuery,
    setLocalZip,
    setPage,
    fetchPage,
    setCursors,
  } = useContactContext();

  return async () => {
    // Step 1: reset filters inside transition
    await new Promise<void>((resolve) => {
      startTransition(() => {
        setQuery("");
        setLocalQuery("");
        setSelectedZip(null);
        setLocalZip("");
        setSelectedStatus("all");
        setPage(1);
        setCursors({});

        router.replace("/dashboard?page=1");

        // Resolve on next tick (gives state time to flush)
        setTimeout(resolve, 0);
      });
    });

    // Step 2: run server fetch with fresh known values
    await fetchPage(1, "all", "");
  };
}
