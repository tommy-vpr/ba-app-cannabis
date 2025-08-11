"use client";

import { useMemo } from "react";
import { useCannabisCompanies } from "@/context/CompanyContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  query: string;
  setQuery: (value: string) => void;
};

export default function SearchMatches({ query, setQuery }: Props) {
  const { companies } = useCannabisCompanies(); // already zip-filtered server-side if user set a ZIP
  const router = useRouter();

  const q = query.trim();
  const isZipLike = /^\d{3,}$/.test(q); // simple heuristic: 3+ digits → treat as ZIP search

  const matches = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();

    const filtered = companies.filter((c) => {
      const nameHit = c.name?.toLowerCase().includes(lower);
      const zipHit = isZipLike ? (c.zip ?? "").startsWith(q) : false;
      return nameHit || zipHit;
    });

    return filtered.slice(0, 10); // cap results
  }, [companies, q, isZipLike]);

  if (!q || matches.length === 0) return null;

  const highlight = (text: string, needle: string) => {
    if (!text) return text;
    const idx = text.toLowerCase().indexOf(needle.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 dark:bg-yellow-600/40 rounded-sm">
          {text.slice(idx, idx + needle.length)}
        </mark>
        {text.slice(idx + needle.length)}
      </>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key="matches"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className="w-full md:w-2/3 mx-auto bg-white text-zinc-800 dark:bg-[#161b22]
        dark:border dark:border-[#30363d] shadow-md rounded-md p-4 mt-1"
      >
        <div className="text-sm mb-2 text-zinc-400 dark:text-gray-500">
          Results:
        </div>

        <ul className="space-y-1">
          {matches.map((company) => {
            const nameContent = highlight(company.name ?? "", q);
            const zipContent =
              isZipLike && company.zip?.startsWith(q)
                ? highlight(company.zip, q)
                : company.zip;

            return (
              <li key={company.id}>
                <button
                  onClick={() => {
                    router.push(`/dashboard/companies/${company.id}`);
                    setQuery(""); // reset search input
                  }}
                  className="cursor-pointer text-left text-zinc-800 dark:text-gray-200 rounded-sm px-2 py-1 hover:bg-muted/50 w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <span className="font-medium">{nameContent}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {company.city
                        ? `${company.city}, ${company.state}`
                        : company.state}
                      {company.city || company.state ? " · " : ""}
                      {zipContent || "—"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
