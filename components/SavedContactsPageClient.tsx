"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { ContactCard } from "@/components/ContactCard";
import { HubSpotContactWithSaved } from "@/types/hubspot";
import { SkeletonCard } from "./skeleton/SkeletonCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SavedContactsPageClient() {
  const { data, mutate } = useSWR("/api/saved-contacts-list", fetcher);
  const [localContacts, setLocalContacts] = useState<
    HubSpotContactWithSaved[] | null
  >(null);

  useEffect(() => {
    if (data?.contacts) {
      setLocalContacts(data.contacts);
    }
  }, [data]);

  const contacts: HubSpotContactWithSaved[] =
    localContacts ?? data?.contacts ?? [];

  const handleUnsave = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setLocalContacts(updated); // Update local UI
    mutate({ contacts: updated }, false); // Update SWR cache manually
  };

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return <p className="text-gray-500">You have no saved contacts yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          href={contact.id}
          savedIds={contacts.map((c) => c.id)}
          mutateSavedIds={() => handleUnsave(contact.id)} // only removes from localContacts
        />
      ))}
    </div>
  );
}
