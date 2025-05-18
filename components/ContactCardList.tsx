"use client";

import { ContactCard } from "./ContactCard";
import { useContactContext } from "@/context/ContactContext";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { CreateContactModal } from "@/components/CreateContactModal";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ContactCardList() {
  const { contacts, loading, query, selectedZip, selectedStatus } =
    useContactContext();

  const [openContactModal, setOpenContactModal] = useState(false);
  const { data, isLoading: loadingSaved } = useSWR(
    "/api/saved-contacts",
    fetcher
  );
  const savedIds: string[] = data?.savedIds || [];

  if (loading || loadingSaved) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const noResults =
    contacts.length === 0 && (query || selectedZip || selectedStatus !== "all");

  if (noResults) {
    return (
      <div className="text-center py-10 flex flex-col justify-center items-center gap-2">
        <p className="text-gray-400">No contacts found.</p>
        <button
          onClick={() => setOpenContactModal(true)}
          className="cursor-pointer px-3 py-1 border border-green-400 text-green-400 
            hover:bg-green-400 hover:text-black transition duration-200 rounded-sm"
        >
          + New Contact
        </button>
        <CreateContactModal
          open={openContactModal}
          setOpen={setOpenContactModal}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id + contact.properties.company}
          contact={{ ...contact, isSaved: savedIds.includes(contact.id) }}
          href={contact.id}
          savedIds={savedIds}
        />
      ))}
    </div>
  );
}
