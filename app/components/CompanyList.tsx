"use client";

import { useCannabisCompanies } from "@/context/CompanyContext";
import { SkeletonCompanyList } from "@/app/components/skeleton/SkeletonCompanyList";
import { MapPin, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadStatus } from "@/types/company";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { PiSeal, PiSealCheckFill } from "react-icons/pi";

export const CompanyList = () => {
  const {
    companies,
    filteredCompanies,
    loading,
    page,
    goToPage,
    hasNextPage,
    toggleBookmark,
    // NEW:
    statusFilter,
    setStatusFilter,
    searchQuery,
  } = useCannabisCompanies();

  const router = useRouter();
  const pathname = usePathname();

  // show filtered when search/status is active; else raw companies
  const list =
    searchQuery?.trim() || statusFilter !== "All"
      ? filteredCompanies
      : companies;

  console.log("Companies", list);

  return (
    <div className="space-y-4">
      {loading ? (
        <SkeletonCompanyList />
      ) : list.length === 0 && companies.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">No company found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list.map((company) => (
              <div
                key={company.id}
                onClick={() =>
                  router.push(`${pathname}/companies/${company.id}`)
                }
                className="group cursor-pointer hover:-translate-y-0.5 duration-150 relative p-4 rounded-md shadow-md shadow-gray-200 
                dark:shadow-black/30 hover:shadow-lg transition h-full flex flex-col gap-2 bg-white dark:bg-[#161b22] dark:border dark:border-[#30363d]"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // <-- don't navigate when bookmarking
                    toggleBookmark(company.id);
                  }}
                  className="cursor-pointer absolute top-2 right-2 text-yellow-400 hover:scale-110 transition-transform"
                  aria-label={company.isBookmarked ? "Unbookmark" : "Bookmark"}
                >
                  {company.isBookmarked ? (
                    <PiSealCheckFill size={20} />
                  ) : (
                    <PiSeal size={20} />
                  )}
                </button>

                <h2 className="text-md mb-2 font-bold text-zinc-600 dark:text-gray-200">
                  {company.legal_business_name}
                </h2>
                <p className="text-xs text-gray-400 flex items-baseline gap-1">
                  <MapPin size={14} />
                  <span>
                    {company.address}, {company.city}, {company.zip}{" "}
                    {company.state}
                  </span>
                </p>

                <LeadStatusBadge
                  status={company.lead_status_l2 as LeadStatus}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination controls: base on page/hasNextPage, not list length */}
      {(page > 1 || hasNextPage) && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || loading}
            className="bg-gray-200 text-zinc-800 hover:bg-gray-300 transition duration-200"
          >
            Previous
          </Button>
          <span className="text-zinc-800 dark:text-gray-200 text-sm mt-2">
            Page {page}
          </span>
          <Button
            onClick={() => goToPage(page + 1)}
            disabled={!hasNextPage || loading}
            className="bg-gray-200 text-zinc-800 hover:bg-gray-300 transition duration-200"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
