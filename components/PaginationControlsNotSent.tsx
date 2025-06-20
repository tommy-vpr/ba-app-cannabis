"use client";

import { useContactContext } from "@/context/ContactContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function PaginationControlsNotSent() {
  const {
    notSentSamplePage,
    notSentSampleCursors,
    notSentSampleHasNext,
    fetchNotSentSamplesPage,
    query,
    selectedZip,
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
    const nextPage = notSentSamplePage + 1;
    const afterCursor = notSentSampleCursors[notSentSamplePage];

    await fetchNotSentSamplesPage(
      nextPage,
      query,
      undefined,
      selectedZip,
      afterCursor
    );
    updateSearchParamPage(nextPage);
  };

  const handlePrev = async () => {
    const prevPage = notSentSamplePage - 1;
    const prevCursor =
      prevPage <= 1 ? undefined : notSentSampleCursors[prevPage - 1];

    await fetchNotSentSamplesPage(
      prevPage,
      query,
      undefined,
      selectedZip,
      prevCursor
    );
    updateSearchParamPage(prevPage);
  };

  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button
        onClick={handlePrev}
        disabled={notSentSamplePage <= 1}
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50"
      >
        <ArrowLeft size={16} /> Prev
      </button>
      <span className="text-sm text-muted-foreground">
        Page {notSentSamplePage}
      </span>
      <button
        onClick={handleNext}
        disabled={!notSentSampleHasNext}
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50"
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
}
