"use client";

import { useEffect, useState } from "react";
import { ContactCard } from "@/components/ContactCard";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { HubSpotContactWithSaved } from "@/types/hubspot";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function SavedContactsPageClient() {
  const [contacts, setContacts] = useState<HubSpotContactWithSaved[]>([]);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSavedPage = async (page: number, after?: string | null) => {
    setLoading(true);
    const res = await fetch(
      `/api/saved-contacts-list?limit=12${after ? `&after=${after}` : ""}`
    );
    const json = await res.json();
    setContacts(json.contacts);
    setHasNext(json.hasNext);
    setPage(page);
    setCursors((prev) => ({ ...prev, [page + 1]: json.nextCursor ?? null }));
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedPage(1);
  }, []);

  const handleNext = () => {
    const after = cursors[page + 1] || contacts[contacts.length - 1]?.id;
    fetchSavedPage(page + 1, after);
  };

  const handlePrev = () => {
    const prevCursor = page <= 2 ? null : cursors[page - 1];
    fetchSavedPage(page - 1, prevCursor);
  };

  const handleUnsave = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">You have no saved contacts yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                href={contact.id}
                savedIds={contacts.map((c) => c.id)}
                mutateSavedIds={() => handleUnsave(contact.id)}
              />
            ))}
          </div>

          {/* 🔁 Pagination Buttons */}
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className="hover:opacity-80 transition duration-200 cursor-pointer 
              flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} /> Prev
            </button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="hover:opacity-80 transition duration-200 cursor-pointer 
              flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// "use client";

// import useSWR from "swr";
// import { useEffect, useState } from "react";
// import { ContactCard } from "@/components/ContactCard";
// import { HubSpotContactWithSaved } from "@/types/hubspot";
// import { SkeletonCard } from "./skeleton/SkeletonCard";
// import { PaginationControls } from "./PaginationControls";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export function SavedContactsPageClient() {
//   const { data, mutate } = useSWR("/api/saved-contacts-list", fetcher);
//   const [localContacts, setLocalContacts] = useState<
//     HubSpotContactWithSaved[] | null
//   >(null);

//   useEffect(() => {
//     if (data?.contacts) {
//       setLocalContacts(data.contacts);
//     }
//   }, [data]);

//   const contacts: HubSpotContactWithSaved[] =
//     localContacts ?? data?.contacts ?? [];

//   const handleUnsave = (id: string) => {
//     const updated = contacts.filter((c) => c.id !== id);
//     setLocalContacts(updated); // Update local UI
//     mutate({ contacts: updated }, false); // Update SWR cache manually
//   };

//   if (!data) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
//         {Array.from({ length: 12 }).map((_, i) => (
//           <SkeletonCard key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (contacts.length === 0) {
//     return <p className="text-gray-500">You have no saved contacts yet.</p>;
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {contacts.map((contact) => (
//           <ContactCard
//             key={contact.id}
//             contact={contact}
//             href={contact.id}
//             savedIds={contacts.map((c) => c.id)}
//             mutateSavedIds={() => handleUnsave(contact.id)} // only removes from localContacts
//           />
//         ))}
//       </div>
//       <PaginationControls />
//     </>
//   );
// }
