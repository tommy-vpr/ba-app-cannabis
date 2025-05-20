"use client";

import { useState } from "react";
import useSWR from "swr";
import { ContactCard } from "@/components/ContactCard";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { HubSpotContact } from "@/types/hubspot";
import { CreateContactModal } from "@/components/CreateContactModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactZipClient({ zip }: { zip: string }) {
  const [openContactModal, setOpenContactModal] = useState(false);

  const { data, isLoading } = useSWR<{ contacts: HubSpotContact[] }>(
    `/api/zip-codes/${zip}`,
    fetcher
  );

  const { data: savedData, isLoading: loadingSaved } = useSWR(
    "/api/saved-contacts",
    fetcher
  );

  const contacts = data?.contacts ?? [];
  const savedIds: string[] = savedData?.savedIds || [];

  if (isLoading || loadingSaved) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-10 flex flex-col justify-center items-center gap-2">
        <p className="text-gray-400">No contacts found in ZIP {zip}.</p>
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
          key={contact.id}
          contact={{ ...contact, isSaved: savedIds.includes(contact.id) }}
          href={contact.id}
          savedIds={savedIds}
        />
      ))}
    </div>
  );
}
