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

type ContactContextType = {
  contacts: HubSpotContact[];
  optimisticUpdate: (
    id: string,
    updates: Partial<HubSpotContact["properties"]>
  ) => void;
  setContacts: (data: HubSpotContact[]) => void;
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
  setStatusCounts: (s: StatusCount) => void;
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
    "pending visit": 0,
    "visit requested by rep": 0,
    "dropped off": 0,
  },
}: {
  children: React.ReactNode;
  initialContacts?: HubSpotContact[];
  initialCursors?: Record<number, string | null>;
  initialHasNext?: boolean;
  initialStatusCounts?: StatusCount;
}) => {
  const [contacts, setContacts] = useState(initialContacts);
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
  const [statusCounts, setStatusCounts] =
    useState<StatusCount>(initialStatusCounts);

  const [availableZips, setAvailableZips] = useState<string[]>([]);

  const [localQuery, setLocalQuery] = useState("");
  const [localZip, setLocalZip] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [contactMutate, setContactMutate] = useState<(() => void) | null>(null);
  const [logListRef, setLogListRef] =
    useState<React.RefObject<MeetingLogListRef | null> | null>(null);

      const [contactId, setContactId] = useState<string | null>(null);
  const [logContactData, setLogContactData] = useState<HubSpotContact | null>(null);
const [logMutate, setLogMutate] = useState<(() => void) | null>(null);


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
    { id: string; properties: Partial<HubSpotContact["properties"]> }
  >(contacts, (state, updated) =>
    state.map((c) =>
      c.id === updated.id
        ? { ...c, properties: { ...c.properties, ...updated.properties } }
        : c
    )
  );

  const optimisticUpdate = (
    id: string,
    updates: Partial<HubSpotContact["properties"]>
  ) => {
    startTransition(() => {
      setOptimisticContacts({ id, properties: updates });
    });
  };

  const fetchPage = (
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
        "litto"
      );

      setContacts(res.contacts);
      setPage(page);
      setHasNext(res.hasNext);

      if (res.after) {
        setCursors((prev) => ({ ...prev, [page]: res.after }));
      }
    });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: optimisticContacts,
        optimisticUpdate,
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
        logMutate
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
