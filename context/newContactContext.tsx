// context/ContactContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { getContacts } from "@/app/actions/getContacts";
import { getStatusCounts } from "@/app/actions/getStatusCounts";
import { HubSpotContact } from "@/types/contact";
import { StatusCount, StatusKey } from "@/types/status";
import { useSession } from "next-auth/react";

type Filters = {
  status: StatusKey;
  zip?: string;
  query?: string;
};

type ContactContextType = {
  contacts: HubSpotContact[];
  statusCounts: StatusCount;
  filters: Filters;
  loading: boolean;
  error: string | null;
  fetchPage: (page?: number) => Promise<void>;
  optimisticRemove: (id: string) => void;
  optimisticAdd: (contact: HubSpotContact) => void;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [filters, setFilters] = useState<Filters>({
    status: StatusKey.All,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticContacts, updateOptimisticContacts] = useOptimistic<
    HubSpotContact[],
    HubSpotContact[] | ((prev: HubSpotContact[]) => HubSpotContact[])
  >(
    [], // initial value
    (state, action) => (typeof action === "function" ? action(state) : action)
  );

  const [statusCounts, setStatusCounts] = useState<StatusCount>({
    [StatusKey.All]: 0,
    [StatusKey.Assigned]: 0,
    [StatusKey.Visited]: 0,
    [StatusKey.DroppedOff]: 0,
    [StatusKey.NotStarted]: 0,
  });

  const fetchPage = useCallback(
    async (newPage = 1) => {
      if (!userEmail) return;
      setLoading(true);
      setError(null);

      try {
        const { contacts } = await getContacts(
          {
            page: newPage,
            status: filters.status,
            zip: filters.zip,
            query: filters.query,
          },
          "litto-cannabis", // or "skwezed" — pass this dynamically if needed
          userEmail
        );
        updateOptimisticContacts(() => contacts);
        setPage(newPage);

        const newCounts = await getStatusCounts("litto-cannabis", userEmail);
        setStatusCounts(newCounts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    },
    [filters, userEmail]
  );

  const optimisticRemove = useCallback((id: string) => {
    updateOptimisticContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const optimisticAdd = useCallback((contact: HubSpotContact) => {
    updateOptimisticContacts((prev) => [contact, ...prev]);
  }, []);

  useEffect(() => {
    if (userEmail) fetchPage(1);
  }, [filters, userEmail]);

  return (
    <ContactContext.Provider
      value={{
        contacts: optimisticContacts,
        filters,
        statusCounts,
        loading,
        error,
        fetchPage,
        optimisticRemove,
        optimisticAdd,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContactContext() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContactContext must be used within a ContactProvider");
  }
  return context;
}
