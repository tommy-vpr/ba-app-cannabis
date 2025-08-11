"use client";

import { Input } from "@/app/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import SearchMatches from "./SearchMatches";
import { useCannabisCompanies } from "@/context/CompanyContext";

export default function SearchNavBar() {
  const [query, setQuery] = useState("");
  const { zipFilter, setZipFilter, setSearchQuery } = useCannabisCompanies();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query.trim());
  };

  const clearQuery = () => {
    setQuery("");
    setSearchQuery("");
  };

  const clearZip = () => {
    setZipFilter("");
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div className="flex flex-col gap-2 px-2 md:px-0 relative z-10">
        <div className="flex gap-2 w-full md:w-2/3 mx-auto">
          {/* Company name search (client-side suggestions) */}
          <div className="relative w-full">
            <Input
              placeholder="Search Store"
              className="w-full pr-10 bg-white shadow-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={(e) => setSearchQuery(e.target.value.trim())}
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/60"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center text-gray-400 dark:text-gray-100/20">
            or
          </div>

          {/* ZIP filter (server-side) */}
          <div className="relative max-w-[180px] w-full">
            <Input
              placeholder="ZIP"
              className="w-full pr-10 bg-white shadow-none"
              value={zipFilter}
              onChange={(e) => setZipFilter(e.target.value)}
              inputMode="numeric"
              pattern="\d{5}(-\d{4})?"
              maxLength={10}
            />
            {zipFilter && (
              <button
                type="button"
                onClick={clearZip}
                aria-label="Clear ZIP"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/60"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* <button
            className="flex items-center justify-center px-1 md:px-3 text-gray-400 dark:text-gray-100/60"
            aria-label="Search"
            type="submit"
          >
            <Search size={18} />
          </button> */}
        </div>
      </div>

      {/* Absolute Match List Below (name-only suggestions) */}
      <div className="absolute left-0 right-0 top-full z-20">
        <SearchMatches query={query} setQuery={setQuery} />
      </div>
    </form>
  );
}
