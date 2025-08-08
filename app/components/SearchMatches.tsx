"use client";

import { useCannabisCompanies } from "@/context/CompanyContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchMatches({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  const { companies } = useCannabisCompanies();
  const router = useRouter();

  const matches = query
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (matches.length === 0 || !query) return null;

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
          {matches.map((company) => (
            <li key={company.id}>
              <button
                onClick={() => {
                  router.push(`/dashboard/companies/${company.id}`);
                  setQuery(""); // reset search input
                }}
                className="cursor-pointer text-left text-zinc-800 dark:text-gray-200 rounded-sm px-2 py-1 hover:bg-muted/50 w-full"
              >
                {company.name}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
