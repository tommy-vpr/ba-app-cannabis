"use client";

import { useEffect, useState } from "react";
import { ContactCard } from "@/components/ContactCard";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { HubSpotContactWithSaved } from "@/types/hubspot";

export function SavedContactsPageClient() {
  const [contacts, setContacts] = useState<HubSpotContactWithSaved[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSavedContacts = async () => {
    setLoading(true);
    const res = await fetch("/api/saved-contacts-list");
    const json = await res.json();
    setContacts(json.contacts);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllSavedContacts();
  }, []);

  const handleUnsave = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
  };

  const handleReorder = async (id: string, newIndex: number) => {
    const currentIndex = contacts.findIndex((c) => c.id === id);
    if (currentIndex === -1 || newIndex === currentIndex) return;

    const reordered = [...contacts];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setContacts(reordered); // Optimistic UI update

    const orderPayload = reordered.map((contact, i) => ({
      id: contact.dbId, // Make sure contact.dbId exists in your type and data
      position: i,
    }));

    const res = await fetch("/api/reorder-saved-contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderPayload }),
    });

    if (!res.ok) {
      console.error("Failed to save new order");
      // Optionally rollback or show toast
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              href={contact.id}
              savedIds={contacts.map((c) => c.id)}
              mutateSavedIds={() => handleUnsave(contact.id)}
              index={index + 1}
              onReorder={handleReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
