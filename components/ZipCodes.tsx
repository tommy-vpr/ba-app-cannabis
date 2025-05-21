"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ZipCodes({ brand }: { brand: "litto-cannabis" | "skwezed" }) {
  const [zips, setZips] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  zips.map((z) => console.log(typeof z));

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
    // Load initial ZIPs on mount
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {zips.map((zip) => (
          <span
            key={zip}
            onClick={() => router.push(`/dashboard/zip-codes/${zip}`)}
            className="transition duration-200 cursor-pointer px-3 py-1 rounded-full bg-gray-200 border border-gray-300 
              dark:border-[#30363d] dark:bg-[#212830] text-sm text-gray-800 dark:text-gray-200
              dark:hover:bg-[#30363d] hover:bg-gray-300"
          >
            {zip}
          </span>
        ))}
        {loading &&
          Array.from({ length: 24 }).map((_, i) => (
            <span
              key={"loading-" + i}
              className="animate-pulse px-3 py-1 rounded-full bg-gray-200 dark:bg-[#30363d] h-6 w-16"
            ></span>
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

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // ✅ import router
// import { getAllZipCodesFromHubSpot } from "@/app/actions/getAllZipCodesFromHubSpot";

// export function ZipCodes({ brand }: { brand: "litto-cannabis" | "skwezed" }) {
//   const [zips, setZips] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter(); // ✅ initialize router

//   useEffect(() => {
//     const load = async () => {
//       const data = await getAllZipCodesFromHubSpot(brand);
//       setZips(data);
//       setLoading(false);
//     };
//     load();
//   }, [brand]);

//   if (loading)
//     return (
//       <div className="flex flex-wrap gap-2 mt-4">
//         {Array.from({ length: 24 }).map((_, i) => (
//           <span
//             key={i}
//             className="animate-pulse px-3 py-1 rounded-full bg-gray-200 dark:bg-[#30363d] h-6 w-16"
//           ></span>
//         ))}
//       </div>
//     );

//   return (
//     <div className="flex flex-wrap gap-2 mt-4">
//       {zips.map((zip) => (
//         <span
//           key={zip}
//           onClick={() => router.push(`/dashboard/zip-codes/${zip}`)} // ✅ navigate on click
//           className="transition duration-200 cursor-pointer px-3 py-1 rounded-full bg-gray-200 border border-gray-300
//             dark:border-[#30363d] dark:bg-[#161b22] text-sm text-gray-800 dark:text-white
//             dark:hover:bg-[#30363d] hover:bg-gray-300"
//         >
//           {zip}
//         </span>
//       ))}
//     </div>
//   );
// }
