"use client";

import { ContactCard } from "./ContactCard";
import { useContactContext } from "@/context/ContactContext";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { CreateContactModal } from "@/components/CreateContactModal";
import { useState } from "react";
import useSWR from "swr";

import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ContactCardList() {
  const {
    contacts,
    loading,
    query,
    selectedZip,
    selectedStatus,
    setQuery,
    setPage,
    setSelectedStatus,
    setSelectedZip,
    setCursors,
    fetchPage,
    setLocalQuery,
    setLocalZip,
  } = useContactContext();

  const [openContactModal, setOpenContactModal] = useState(false);
  const { data, isLoading: loadingSaved } = useSWR(
    "/api/saved-contacts",
    fetcher
  );
  const savedIds: string[] = data?.savedIds || [];

  const router = useRouter();

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
    <div className="w-full flex flex-col">
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
      {contacts.length === 1 && (
        <div className="text-center my-4">
          <button
            onClick={async () => {
              setQuery("");
              setLocalQuery("");
              setSelectedZip(null);
              setLocalZip("");
              setSelectedStatus("all");
              setPage(1);
              setCursors({});
              router.replace(`/dashboard`);
              await fetchPage(1, "all", "");
            }}
            className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            View All Contacts
          </button>
        </div>
      )}
    </div>
  );
}
