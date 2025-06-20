"use client";

import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { HubSpotContact } from "@/types/contact";
import { getContacts } from "@/app/actions/getContacts";
import { StatusCount } from "@/types/status";
import { MeetingLogListRef } from "@/types/meeting";
import { useBrand } from "@/context/BrandContext"; // ✅

import { StatusKey } from "@/types/status"; // Assuming correct import path
import { useSession } from "next-auth/react";
import { getNotSentSamplesContacts } from "@/app/actions/getNotSentSamplesContacts";
import { boolean } from "zod";
import useSWR from "swr";
import { getStatusCounts } from "@/app/actions/getStatusCounts";

type ContactContextType = {
  contacts: HubSpotContact[];
  optimisticUpdate: (
    id: string,
    updates: Partial<HubSpotContact["properties"]>
  ) => void;
  setContacts: React.Dispatch<React.SetStateAction<HubSpotContact[]>>;
  setOptimisticContacts: (
    action:
      | ((prev: HubSpotContact[]) => HubSpotContact[])
      | { id: string; properties: Partial<HubSpotContact["properties"]> }
  ) => void;

  fetchPage: (
    page: number,
    status?: string,
    query?: string,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip?: string | null,
    after?: string | null // ✅ Add this
  ) => void;
  loading: boolean;
  page: number;
  setPage: (n: number) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  query: string;
  setQuery: (q: string) => void;
  selectedZip: string | null;
  setSelectedZip: (z: string | null) => void;
  hasNext: boolean;
  cursors: Record<number, string | null>;
  setCursors: (c: Record<number, string | null>) => void;
  selectedContact: HubSpotContact | null;
  setSelectedContact: (c: HubSpotContact | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  statusCounts: StatusCount;
  setStatusCounts: React.Dispatch<React.SetStateAction<StatusCount>>;
  availableZips: string[];
  setAvailableZips: (zips: string[]) => void;
  localQuery: string;
  setLocalQuery: (q: string) => void;
  localZip: string;
  setLocalZip: (z: string) => void;
  logOpen: boolean;
  setLogOpen: (open: boolean) => void;
  contactMutate: (() => void) | null;
  setContactMutate: (fn: (() => void) | null) => void;
  logListRef: React.RefObject<MeetingLogListRef | null> | null;
  setLogListRef: (
    ref: React.RefObject<MeetingLogListRef | null> | null
  ) => void;
  contactId: string | null;
  setContactId: (id: string | null) => void;
  logContactData: HubSpotContact | null;
  setLogContactData: (data: HubSpotContact | null) => void;
  logMutate: (() => void) | null;
  setLogMutate: (fn: (() => void) | null) => void;
  updateContactInList: (updated: HubSpotContact) => void;
  // ✅ Added for Not Sent Samples
  refreshCounts: () => Promise<void>;

  notSentSampleContacts: HubSpotContact[];
  fetchNotSentSamplesPage: (
    page: number,
    query?: string,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip?: string | null,
    after?: string | null
  ) => void;
  notSentSamplePage: number;
  notSentSampleCursors: Record<number, string | null>;
  notSentSampleHasNext: boolean;
};

const ContactContext = createContext<ContactContextType | null>(null);

export const useContactContext = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("Must use inside ContactProvider");
  return ctx;
};

export const ContactProvider = ({
  children,
  initialContacts = [],
  initialCursors = {},
  initialHasNext = false,
  initialStatusCounts = {
    all: 0,
    Assigned: 0,
    Visited: 0,
    "Dropped Off": 0,
    "Not Started": 0,
  },
}: {
  children: React.ReactNode;
  initialContacts?: HubSpotContact[];
  initialCursors?: Record<number, string | null>;
  initialHasNext?: boolean;
  initialStatusCounts?: StatusCount;
}) => {
  const [contacts, setContacts] = useState<HubSpotContact[]>(initialContacts);

  const [statusCounts, setStatusCounts] =
    useState<StatusCount>(initialStatusCounts);

  const [cursors, setCursors] =
    useState<Record<number, string | null>>(initialCursors);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [isPending, startTransition] = useTransition();
  const [selectedContact, setSelectedContact] = useState<HubSpotContact | null>(
    null
  );
  const [editOpen, setEditOpen] = useState(false);

  const [availableZips, setAvailableZips] = useState<string[]>([]);

  const [localQuery, setLocalQuery] = useState("");
  const [localZip, setLocalZip] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [contactMutate, setContactMutate] = useState<(() => void) | null>(null);
  const [logListRef, setLogListRef] =
    useState<React.RefObject<MeetingLogListRef | null> | null>(null);

  const [contactId, setContactId] = useState<string | null>(null);
  const [logContactData, setLogContactData] = useState<HubSpotContact | null>(
    null
  );
  const [logMutate, setLogMutate] = useState<(() => void) | null>(null);
  const { brand } = useBrand();

  const { data: session } = useSession();
  const email = session?.user?.email;

  const [notSentSampleContacts, setNotSentSampleContacts] = useState<any[]>([]);
  const [notSentSampleCursors, setNotSentSampleCursors] = useState<
    Record<number, string | null>
  >({});
  const [notSentSampleHasNext, setNotSentSampleHasNext] = useState(false);
  const [notSentSamplePage, setNotSentSamplePage] = useState(1);
  // const [loading, setLoading] = useState(false);

  const refreshCounts = async () => {
    if (!email || !brand) return;
    const counts = await getStatusCounts(brand, email);
    console.log("[refreshCounts] Fetched updated counts:", counts);

    setStatusCounts({ ...counts });
  };

  const fetchNotSentSamplesPage = async (
    page: number,
    query?: string,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip?: string | null,
    after?: string | null
  ) => {
    if (!email) return;
    // setLoading(true);

    const res = await getNotSentSamplesContacts(
      { limit: 12, query, zip: zip ?? undefined, after: after ?? undefined },
      brand,
      email
    );

    setNotSentSampleContacts(
      typeof updater === "function" ? updater(res.contacts) : res.contacts
    );
    setNotSentSampleHasNext(res.hasNext);
    setNotSentSamplePage(page);
    setNotSentSampleCursors((prev) => ({
      ...prev,
      [page]: res.after,
    }));

    // setLoading(false);
  };

  useEffect(() => {
    const uniqueZips = Array.from(
      new Set(
        contacts
          .map((c) => c?.properties?.zip)
          .filter(
            (zip): zip is string => typeof zip === "string" && zip.trim() !== ""
          )
      )
    );
    setAvailableZips(uniqueZips);
  }, [contacts]);

  const [optimisticContacts, setOptimisticContacts] = useOptimistic<
    HubSpotContact[],
    | ((prev: HubSpotContact[]) => HubSpotContact[])
    | { id: string; properties: Partial<HubSpotContact["properties"]> }
  >(contacts, (state, action) => {
    if (typeof action === "function") {
      return action(state); // for prepend, delete, etc.
    }

    // for updating contact properties
    return state.map((c) =>
      c.id === action.id
        ? { ...c, properties: { ...c.properties, ...action.properties } }
        : c
    );
  });

  const fetchPage = async (
    page: number,
    status = selectedStatus,
    q = query,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip = selectedZip,
    after?: string | null
  ) => {
    console.log("[fetchPage] called with:", { page, status, q }); // ✅ here

    startTransition(async () => {
      if (updater) {
        setContacts((prev) => updater(prev));
        setPage(page);
        return;
      }

      const res = await getContacts(
        {
          page,
          status,
          query: q,
          zip: zip ?? undefined, // ✅ ensure zip is undefined, not null
          after: after ?? cursors[page - 1] ?? undefined, // ✅ convert null to undefined
        },
        brand,
        email ?? ""
      );

      setContacts(res.contacts);
      setPage(page);
      setHasNext(res.hasNext);

      if (res.after) {
        setCursors((prev) => ({ ...prev, [page]: res.after }));
      }
    });
  };

  const optimisticUpdate = (
    id: string,
    updates: Partial<HubSpotContact["properties"]>
  ) => {
    startTransition(() => {
      setOptimisticContacts({ id, properties: updates });
    });
  };

  function isValidStatusKey(key: string): key is StatusKey {
    return Object.values(StatusKey).includes(key as StatusKey);
  }

  const updateContactInList = (updated: HubSpotContact) => {
    setContacts((prev) => {
      const existing = prev.find((c) => c.id === updated.id);

      const newStatusRaw = updated.properties.lead_status_l2 ?? "";
      const prevStatusRaw = existing?.properties.lead_status_l2 ?? "";

      const newStatus = isValidStatusKey(newStatusRaw)
        ? newStatusRaw
        : undefined;
      const prevStatus = isValidStatusKey(prevStatusRaw)
        ? prevStatusRaw
        : undefined;

      if (existing) {
        if (newStatus && prevStatus && newStatus !== prevStatus) {
          setStatusCounts((counts) => ({
            ...counts,
            [prevStatus]: Math.max((counts[prevStatus] || 0) - 1, 0),
            [newStatus]: (counts[newStatus] || 0) + 1,
            all: counts.all, // stays the same
          }));
        }

        return prev.map((c) => (c.id === updated.id ? updated : c));
      }

      if (newStatus) {
        const statusOk =
          selectedStatus === StatusKey.All || newStatus === selectedStatus;

        const queryOk =
          !query ||
          updated.properties.company
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          updated.properties.email?.toLowerCase().includes(query.toLowerCase());

        const zipOk =
          !selectedZip ||
          updated.properties.zip?.toString().includes(selectedZip.toString());

        if (statusOk && queryOk && zipOk) {
          setStatusCounts((counts) => ({
            ...counts,
            [newStatus]: (counts[newStatus] || 0) + 1,
            all: counts.all + 1,
          }));

          return [updated, ...prev.filter((c) => c.id !== updated.id)];
        }
      }

      return prev;
    });
  };

  useEffect(() => {
    const isFiltered =
      window?.location?.search.includes("query") ||
      window?.location?.search.includes("zip") ||
      window?.location?.search.includes("status");

    if (initialContacts.length === 0 || isFiltered) {
      fetchPage(1, "all", "");
    }
  }, [brand]);

  return (
    <ContactContext.Provider
      value={{
        contacts: optimisticContacts,
        optimisticUpdate,
        setOptimisticContacts,
        setContacts,
        fetchPage,
        loading: isPending,
        page,
        setPage,
        selectedStatus,
        setSelectedStatus,
        query,
        setQuery,
        selectedZip,
        setSelectedZip,
        hasNext,
        cursors,
        setCursors,
        editOpen,
        setEditOpen,
        setSelectedContact,
        selectedContact,
        statusCounts,
        setStatusCounts,
        availableZips,
        setAvailableZips,
        localQuery,
        setLocalQuery,
        localZip,
        setLocalZip,
        logOpen,
        setLogOpen,
        contactMutate,
        setContactMutate,
        logListRef,
        setLogListRef,
        contactId,
        setContactId,
        logContactData,
        setLogContactData,
        setLogMutate,
        logMutate,
        updateContactInList,
        notSentSampleContacts,
        fetchNotSentSamplesPage,
        notSentSamplePage,
        notSentSampleCursors,
        notSentSampleHasNext,
        refreshCounts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
