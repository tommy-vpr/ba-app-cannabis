"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function ZipCodes({ brand }: { brand: "litto-cannabis" | "skwezed" }) {
  const [zips, setZips] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadMore = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/zip-codes?brand=${brand}&after=${after ?? ""}`
    );
    const data = await res.json();

    const newZips = Array.isArray(data.zips) ? data.zips : [];
    const unique = new Set([...zips, ...newZips]);

    setZips(Array.from(unique).sort((a, b) => a.localeCompare(b)));
    setAfter(data.after ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
        {!loading && zips.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center w-full">
            No zip codes found.
          </p>
        ) : (
          zips.map((zip) => (
            <span
              key={zip}
              onClick={() => router.push(`/dashboard/zip-codes/${zip}`)}
              className="w-20 h-8 flex items-center justify-center transition duration-200 cursor-pointer 
              rounded-full bg-gray-200 border border-gray-300 
              dark:border-[#30363d] dark:bg-[#212830] text-sm text-gray-800 dark:text-gray-200
              dark:hover:bg-[#30363d] hover:bg-gray-300"
            >
              {zip}
            </span>
          ))
        )}

        {loading &&
          Array.from({ length: 24 }).map((_, i) => (
            <span
              key={`loading-${i}`}
              className="w-20 h-8 flex items-center justify-center rounded-full 
              animate-pulse bg-gray-200 dark:bg-[#30363d]"
            />
          ))}
      </div>

      {after && !loading && (
        <button
          onClick={loadMore}
          className="cursor-pointer block mx-auto text-sm px-4 py-2 border border-gray-300 dark:border-[#30363d] 
            rounded hover:bg-gray-100 dark:hover:bg-[#212830] transition"
        >
          Load More ZIPs
        </button>
      )}
    </div>
  );
}
