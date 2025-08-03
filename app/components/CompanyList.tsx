"use client";

import { useCannabisCompanies } from "@/context/CompanyContext";
import { SkeletonCompanyList } from "@/app/components/skeleton/SkeletonCompanyList";
import { MapPin, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const CompanyList = () => {
  const { companies, loading, hasNextPage, loadMore, toggleBookmark } =
    useCannabisCompanies();

  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {loading && companies.length === 0 ? (
        <SkeletonCompanyList />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Link
                href={`${pathname}/companies/${company.id}`}
                key={company.id}
              >
                <div className="border rounded-lg p-4 shadow bg-zinc-900 relative">
                  <button
                    onClick={() => toggleBookmark(company.id)}
                    className="absolute top-2 right-2 text-yellow-400 hover:scale-110 transition-transform"
                  >
                    {company.isBookmarked ? (
                      <BookmarkCheck size={20} />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </button>

                  <h2 className="text-md mb-2 font-bold text-gray-200">
                    {company.legal_business_name}
                  </h2>
                  <p className="text-xs text-gray-400 flex items-baseline gap-1">
                    <MapPin size={14} />
                    <span>
                      {company.address}, {company.city}, {company.zip}{" "}
                      {company.state}
                    </span>
                  </p>

                  <div className="mt-2 px-3 py-1 rounded-full w-fit text-xs border border-blue-400 text-blue-400">
                    Not Started
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center">
              <Button onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
