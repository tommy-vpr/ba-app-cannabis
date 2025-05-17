"use client";

import { useContactContext } from "@/context/ContactContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function PaginationControls() {
  const {
    page,
    setPage,
    hasNext,
    fetchPage,
    selectedStatus,
    query,
    selectedZip,
    cursors,
  } = useContactContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParamPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = async () => {
    const nextPage = page + 1;
    const afterCursor = cursors[page]; // cursor for current page gets us to next

    await fetchPage(
      nextPage,
      selectedStatus,
      query,
      undefined,
      selectedZip,
      afterCursor
    );
    updateSearchParamPage(nextPage);
  };

  const handlePrev = async () => {
    const prevPage = page - 1;
    const prevCursor = prevPage <= 1 ? undefined : cursors[prevPage - 1];

    await fetchPage(
      prevPage,
      selectedStatus,
      query,
      undefined,
      selectedZip,
      prevCursor
    );
    updateSearchParamPage(prevPage);
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = !hasNext || !cursors[page];

  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className="hover:opacity-80 transition duration-200 cursor-pointer 
        flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={16} /> Prev
      </button>

      <span className="text-sm text-muted-foreground">Page {page}</span>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="hover:opacity-80 transition duration-200 cursor-pointer 
        flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
}
