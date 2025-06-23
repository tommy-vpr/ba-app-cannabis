// "use client";

// import { Input } from "@/components/ui/input";
// import { IconX } from "@tabler/icons-react";
// import { Search } from "lucide-react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useContactContext } from "@/context/ContactContext";
// import { useEffect, useRef, useState } from "react";
// import { StatusKey, statusList, statusLabels } from "@/types/status";

// export default function SearchAndFilter() {
//   const {
//     selectedStatus,
//     setSelectedStatus,
//     setQuery,
//     setSelectedZip,
//     fetchPage,
//     statusCounts,
//   } = useContactContext();

//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [localQuery, setLocalQuery] = useState("");
//   const [localZip, setLocalZip] = useState("");

//   // ✅ Load from URL on mount
//   useEffect(() => {
//     const urlQuery = searchParams.get("query") || "";
//     const urlStatus = (searchParams.get("status") as StatusKey) || "all";
//     const urlZip = searchParams.get("zip") || "";

//     setLocalQuery(urlQuery);
//     setLocalZip(urlZip);
//     setQuery(urlQuery);
//     setSelectedZip(urlZip || null);
//     setSelectedStatus(urlStatus);
//   }, []);

//   const updateSearchParams = (newParams: Record<string, string | null>) => {
//     const params = new URLSearchParams(searchParams.toString());
//     for (const key in newParams) {
//       const value = newParams[key];
//       if (!value || value === "all") {
//         params.delete(key);
//       } else {
//         params.set(key, value);
//       }
//     }
//     params.set("page", "1");
//     router.push(`${pathname}?${params.toString()}`);
//   };

//   const handleSearch = async () => {
//     setQuery(localQuery);
//     setSelectedZip(localZip || null);
//     updateSearchParams({
//       query: localQuery,
//       zip: localZip || null,
//       status: selectedStatus,
//     });
//     await fetchPage(1, selectedStatus, localQuery, undefined, localZip || null);
//   };

//   const handleStatusClick = async (status: StatusKey) => {
//     setSelectedStatus(status);
//     updateSearchParams({
//       status,
//       query: localQuery || null,
//       zip: localZip || null,
//     });
//     await fetchPage(1, status, localQuery, undefined, localZip || null);
//   };

//   const handleClearStatus = async () => {
//     setSelectedStatus("all");
//     updateSearchParams({
//       status: "all",
//       query: localQuery || null,
//       zip: localZip || null,
//     });
//     await fetchPage(1, "all", localQuery, undefined, localZip || null);
//   };

//   const handleClearQuery = async () => {
//     setLocalQuery("");
//     setQuery("");
//     updateSearchParams({
//       query: null,
//       zip: localZip || null,
//       status: selectedStatus,
//     });
//     await fetchPage(1, selectedStatus, "", undefined, localZip || null);
//   };

//   const statusStyles: Record<StatusKey, string> = {
//     all: `bg-transparent text-gray-700 dark:text-gray-300`,
//     Assigned: "bg-transparent text-orange-400",
//     Visited: "bg-transparent text-red-400",
//     "Dropped Off": "bg-transparent text-green-400",
//   };

//   const ringColors: Record<StatusKey, string> = {
//     all: "ring-gray-400",
//     Assigned: "ring-orange-400",
//     Visited: "ring-red-400",
//     "Dropped Off": "ring-green-400",
//   };

//   return (
//     <div className="flex flex-col w-full">
//       <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-2 w-full md:justify-between">
//         <div className="flex flex-wrap gap-2">
//           {statusList.map((status) => {
//             const isActive = selectedStatus === status;
//             const count = statusCounts[status];

//             return (
//               <button
//                 key={status}
//                 onClick={() => handleStatusClick(status)}
//                 className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
//                   statusStyles[status]
//                 } ${
//                   isActive
//                     ? `ring-1 ${ringColors[status]} ring-offset-white dark:ring-offset-[#1a1a1a]`
//                     : "opacity-80 hover:opacity-100"
//                 }`}
//               >
//                 {statusLabels[status]} ({count})
//               </button>
//             );
//           })}

//           {selectedStatus !== "all" && (
//             <button
//               onClick={handleClearStatus}
//               className="text-muted-foreground cursor-pointer group"
//             >
//               <IconX className="text-red-400 group-hover:text-white transition duration-200 group-hover:bg-red-400 rounded-sm" />
//             </button>
//           )}
//         </div>

//         <div className="flex gap-2 w-full md:max-w-[600px]">
//           {/* Search Input */}
//           <div className="relative w-full">
//             <Input
//               value={localQuery}
//               onChange={(e) => setLocalQuery(e.target.value)}
//               placeholder="Search company"
//               className="w-full pr-10 bg-white"
//             />
//             {localQuery && (
//               <button
//                 onClick={handleClearQuery}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
//                 aria-label="Clear query"
//               >
//                 <IconX size={16} />
//               </button>
//             )}
//           </div>

//           {/* ZIP Filter Input */}
//           <div className="relative w-[120px]">
//             <Input
//               value={localZip}
//               onChange={(e) => setLocalZip(e.target.value)}
//               placeholder="ZIP"
//               className="w-full pr-10 bg-white"
//             />
//             {localZip && (
//               <button
//                 onClick={() => {
//                   setLocalZip("");
//                   setSelectedZip(null);
//                   updateSearchParams({ zip: null });
//                   fetchPage(1, selectedStatus, localQuery, undefined, null);
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
//                 aria-label="Clear ZIP"
//               >
//                 <IconX size={16} />
//               </button>
//             )}
//           </div>

//           {/* Search Button */}
//           <button
//             onClick={handleSearch}
//             className="flex items-center justify-center px-3 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition"
//             aria-label="Search"
//           >
//             <Search size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
