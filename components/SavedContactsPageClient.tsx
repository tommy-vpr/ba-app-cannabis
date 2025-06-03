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
