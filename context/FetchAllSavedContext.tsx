"use client";

import { createContext, useContext, useState } from "react";
import { HubSpotContactWithSaved } from "@/types/hubspot";

type SavedContactContextType = {
  savedContacts: HubSpotContactWithSaved[];
  fetchAllSavedContacts: () => Promise<void>;
  handleReorder: (id: string, newIndex: number) => Promise<void>;
  loadingSavedContacts: boolean;
};

const SavedContactContext = createContext<SavedContactContextType>({
  savedContacts: [],
  fetchAllSavedContacts: async () => {},
  handleReorder: async () => {},
  loadingSavedContacts: false,
});

export const SavedContactProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [savedContacts, setSavedContacts] = useState<HubSpotContactWithSaved[]>(
    []
  );
  const [loadingSavedContacts, setLoadingSavedContacts] = useState(false);

  const fetchAllSavedContacts = async () => {
    try {
      setLoadingSavedContacts(true);
      const res = await fetch("/api/saved-contacts-list");
      const json = await res.json();
      setSavedContacts(json.contacts || []);
    } catch (err) {
      console.error("Failed to fetch saved contacts", err);
    } finally {
      setLoadingSavedContacts(false);
    }
  };

  const handleReorder = async (id: string, newIndex: number) => {
    const currentIndex = savedContacts.findIndex((c) => c.id === id);
    if (currentIndex === -1 || newIndex === currentIndex) return;

    const reordered = [...savedContacts];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const orderPayload = reordered.map((contact, i) => ({
      id: contact.dbId,
      position: i,
    }));

    setLoadingSavedContacts(true);
    try {
      const res = await fetch("/api/reorder-saved-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });

      if (!res.ok) throw new Error("Failed to save reorder");

      await fetchAllSavedContacts(); // refresh with server data
    } catch (err) {
      console.error("Error reordering:", err);
    } finally {
      setLoadingSavedContacts(false);
    }
  };

  return (
    <SavedContactContext.Provider
      value={{
        savedContacts,
        fetchAllSavedContacts,
        handleReorder,
        loadingSavedContacts,
      }}
    >
      {children}
    </SavedContactContext.Provider>
  );
};

export const useSavedContactContext = () => useContext(SavedContactContext);

// "use client";
// // context/FetchAllSavedContext.tsx

// import { createContext, useContext, useState } from "react";
// import { HubSpotContactWithSaved } from "@/types/hubspot";

// type SavedContactContextType = {
//   savedContacts: HubSpotContactWithSaved[];
//   fetchAllSavedContacts: () => Promise<void>;
// };

// const SavedContactContext = createContext<SavedContactContextType>({
//   savedContacts: [],
//   fetchAllSavedContacts: async () => {},
// });

// export const SavedContactProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [savedContacts, setSavedContacts] = useState<HubSpotContactWithSaved[]>(
//     []
//   );

//   const fetchAllSavedContacts = async () => {
//     try {
//       const res = await fetch("/api/saved-contacts-list");
//       const json = await res.json();
//       setSavedContacts(json.contacts || []);
//     } catch (err) {
//       console.error("Failed to fetch saved contacts", err);
//     }
//   };

//   return (
//     <SavedContactContext.Provider
//       value={{
//         savedContacts,
//         fetchAllSavedContacts,
//       }}
//     >
//       {children}
//     </SavedContactContext.Provider>
//   );
// };

// export const useSavedContactContext = () => useContext(SavedContactContext);
