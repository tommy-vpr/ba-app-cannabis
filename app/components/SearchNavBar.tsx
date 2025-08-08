"use client";

import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import SearchMatches from "./SearchMatches";

export default function SearchNavBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-2 px-2 md:px-0 relative z-10">
        <div className="flex gap-2 w-full md:w-2/3 mx-auto">
          <div className="relative w-full">
            <Input
              placeholder="Search Store"
              className="w-full pr-10 bg-white shadow-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

      {/* Absolute Match List Below */}
      <div className="absolute left-0 right-0 top-full z-20">
        <SearchMatches query={query} setQuery={setQuery} />
      </div>
    </div>
  );
}
