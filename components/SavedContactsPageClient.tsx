"use client";

import { useEffect } from "react";
import { useSavedContactContext } from "@/context/FetchAllSavedContext";
import { ContactCard } from "@/components/ContactCard";
import { SkeletonCard } from "./skeleton/SkeletonCard";

export function SavedContactsPageClient() {
  const {
    savedContacts,
    fetchAllSavedContacts,
    handleReorder,
    loadingSavedContacts,
  } = useSavedContactContext();

  useEffect(() => {
    fetchAllSavedContacts();
  }, []);

  return (
    <div className="w-full">
      {loadingSavedContacts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : savedContacts.length === 0 ? (
        <p className="text-gray-500">You have no saved contacts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedContacts.map((contact, index) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              href={contact.id}
              savedIds={savedContacts.map((c) => c.id)}
              mutateSavedIds={() => {}}
              index={index + 1}
              onReorder={handleReorder} // ✅ just pass it here
            />
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { ContactCard } from "@/components/ContactCard";
// import { SkeletonCard } from "./skeleton/SkeletonCard";
// import { useSavedContactContext } from "@/context/FetchAllSavedContext";

// export function SavedContactsPageClient() {
//   const { savedContacts, fetchAllSavedContacts } = useSavedContactContext();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetchAllSavedContacts().finally(() => setLoading(false));
//   }, []);

//   const handleUnsave = (id: string) => {
//     // Optionally: remove from list locally or refetch
//     // You could also call fetchAllSavedContacts() again after unsaving
//   };

//   const handleReorder = async (id: string, newIndex: number) => {
//     const currentIndex = savedContacts.findIndex((c) => c.id === id);
//     if (currentIndex === -1 || newIndex === currentIndex) return;

//     const reordered = [...savedContacts];
//     const [moved] = reordered.splice(currentIndex, 1);
//     reordered.splice(newIndex, 0, moved);

//     const orderPayload = reordered.map((contact, i) => ({
//       id: contact.dbId,
//       position: i,
//     }));

//     const res = await fetch("/api/reorder-saved-contacts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ order: orderPayload }),
//     });

//     if (!res.ok) {
//       console.error("Failed to save new order");
//       // Optionally rollback or toast
//     } else {
//       await fetchAllSavedContacts();
//     }
//   };

//   return (
//     <div className="w-full">
//       {loading ? (
//         <>
//           {/* loading skeletons */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {Array.from({ length: 12 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         </>
//       ) : savedContacts.length === 0 ? (
//         <p className="text-gray-500">You have no saved contacts yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {savedContacts.map((contact, index) => (
//             <ContactCard
//               key={contact.id}
//               contact={contact}
//               href={contact.id}
//               savedIds={savedContacts.map((c) => c.id)}
//               mutateSavedIds={() => handleUnsave(contact.id)}
//               index={index + 1}
//               onReorder={(id, newIndex) => handleReorder(id, newIndex)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
