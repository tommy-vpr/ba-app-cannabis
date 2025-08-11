// app/zip-codes/page.tsx
"use client";

import Link from "next/link";
import { useCannabisCompanies } from "@/context/CompanyContext";

export default function ZipCodesPage() {
  const { companies, loading } = useCannabisCompanies();

  if (loading) {
    return <p className="text-center text-gray-400 mt-6">Loading ZIP codes…</p>;
  }
  if (!companies?.length) {
    return (
      <p className="text-center text-gray-400 mt-6">No companies found.</p>
    );
  }

  // Build a ZIP -> count map
  const counts = companies.reduce<Record<string, number>>((acc, c) => {
    const zip = String(c.zip ?? "").trim();
    if (!zip) return acc;
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

  // Sort by ZIP ascending (or sort by count desc if you prefer)
  const items = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-xl font-semibold">ZIP Codes</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map(([zip, count]) => (
          <Link
            key={zip}
            href={`/dashboard/zip-codes/${encodeURIComponent(zip)}`}
            className="group block rounded-md border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition bg-white dark:bg-[#161b22]"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-800 dark:text-zinc-100">
                {zip}
              </span>
              <span className="text-xs rounded-full px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {count}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              View companies in {zip}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
