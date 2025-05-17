"use client";

import { ContactCard } from "./ContactCard";
import { useContactContext } from "@/context/ContactContext";
import { SkeletonCard } from "./skeleton/SkeletonCard";
import { CreateContactModal } from "@/components/CreateContactModal";
import { useState } from "react";

export function ContactCardList() {
  const {
    contacts,
    loading,
    query,
    selectedZip,
    statusCounts,
    selectedStatus,
  } = useContactContext();

  const [openContactModal, setOpenContactModal] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const noResults = contacts.length === 0 && (query || selectedZip);

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
          contact={contact}
          href={contact.id}
        />
      ))}
    </div>
  );
}

// "use client";

// import { ContactCard } from "./ContactCard";
// import { useContactContext } from "@/context/ContactContext";
// import { SkeletonCard } from "./skeleton/SkeletonCard";

// export function ContactCardList() {
//   const { contacts, loading, statusCounts, selectedStatus } =
//     useContactContext();

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {Array.from({ length: 12 }).map((_, i) => (
//           <SkeletonCard key={i} />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {contacts.map((contact) => (
//         <ContactCard
//           key={contact.id + contact.properties.company}
//           contact={contact}
//           href={contact.id}
//         />
//       ))}
//     </div>
//   );
// }
