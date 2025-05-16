"use client";

import { ContactCard } from "./ContactCard";
import { useContactContext } from "@/context/ContactContext";
import { SkeletonCard } from "./skeleton/SkeletonCard";

export function ContactCardList() {
  const { contacts, loading, statusCounts, selectedStatus } =
    useContactContext();

  console.log(contacts);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id + contact.properties.company}
          contact={contact}
          href={contact.id}
        />
      ))}
    </div>
  );
}
