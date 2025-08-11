// app/zip-codes/[zip]/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCannabisCompanies } from "@/context/CompanyContext";
import { MapPin } from "lucide-react";
import { LeadStatusBadge } from "@/app/components/LeadStatusBadge"; // adjust path if needed
import type { LeadStatus } from "@/types/company";

export default function ZipCompaniesPage() {
  const { zip } = useParams<{ zip: string }>();
  const { companies, loading } = useCannabisCompanies();

  const list = useMemo(() => {
    if (!companies?.length) return [];
    return companies.filter((c) => String(c.zip ?? "").trim() === String(zip));
  }, [companies, zip]);

  if (loading) {
    return <p className="text-center text-gray-400 mt-6">Loading companies…</p>;
  }

  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Companies in ZIP {zip} ({list.length})
        </h1>
        <Link
          href="/dashboard/zip-codes"
          className="text-sm text-blue-500 transition duration-200 hover:text-blue-400"
        >
          ← All Zipcodes
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">
          No companies found for ZIP {zip}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((company) => (
            <Link
              key={company.id}
              href={`/dashboard/companies/${company.id}`} // ← keep your existing detail route
              className="group block rounded-md shadow-md shadow-gray-200 dark:shadow-black/30 hover:shadow-lg transition p-4 bg-white dark:bg-[#161b22] dark:border dark:border-[#30363d]"
            >
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

              <div className="mt-2">
                <LeadStatusBadge
                  status={company.lead_status_l2 as LeadStatus}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
