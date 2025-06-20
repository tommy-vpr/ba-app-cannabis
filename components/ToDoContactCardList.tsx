import { useContactContext } from "@/context/ContactContext";
import { ContactCard } from "./ContactCard";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { useState } from "react";
import useSWR from "swr";
import { CreateContactModal } from "@/components/CreateContactModal";
import { StatusKey } from "@/types/status";
import { HubSpotContactWithSaved } from "@/types/hubspot";

export function TodoContactCardList() {
  const { contacts, loading, selectedStatus } = useContactContext();
  const [open, setOpen] = useState(false);

  const { data } = useSWR("/api/saved-contacts", (url) =>
    fetch(url).then((res) => res.json())
  );
  const savedIds = data?.savedIds ?? [];

  // ✅ Filter only Not Started contacts when selectedStatus is NotStarted
  const filteredContacts = contacts.filter(
    (c) => c.properties.hs_lead_status !== "Sent Samples"
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  console.log(filteredContacts);

  if (!filteredContacts.length) {
    return (
      <div className="text-center py-10 flex flex-col items-center gap-2">
        <p className="text-gray-400">No contacts found.</p>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-sm"
        >
          + New Contact
        </button>
        <CreateContactModal open={open} setOpen={setOpen} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredContacts.map((contact) => (
        <ContactCard
          key={contact.id + contact.properties.company}
          contact={{
            ...(contact as HubSpotContactWithSaved),
            isSaved: savedIds.includes(contact.id),
            dbId: (contact as any).dbId ?? "unknown",
          }}
          href={contact.id}
          savedIds={savedIds}
        />
      ))}
    </div>
  );
}
