"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Company } from "@/types/company";
import {
  getCannabisCompaniesPaginated,
  LeadStatusFilter,
} from "@/app/actions/getCannabisCompaniesPaginated";
import {
  toggleCompanyBookmark,
  getBookmarkedCompanyIds, // ⬅️ NEW
} from "@/app/actions/bookmarks";

// add a local type that includes the flag
type CompanyWithBookmark = Company & { isBookmarked: boolean };

interface CannabisCompanyContextValue {
  companies: CompanyWithBookmark[]; // ⬅️ updated
  filteredCompanies: CompanyWithBookmark[]; // ⬅️ updated
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: LeadStatusFilter;
  setStatusFilter: (status: LeadStatusFilter) => void;
  zipFilter: string;
  setZipFilter: (zip: string) => void;
  loading: boolean;
  page: number;
  goToPage: (page: number) => Promise<void>;
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  refreshCompanies: () => Promise<void>;
  toggleBookmark: (companyId: string) => void;
  refetchCurrentPage: () => void;
  updateContact: (
    companyId: string,
    contactId: string,
    data: Partial<Company["contacts"][number]>
  ) => void;
  pendingId: string | null; // ✅ NEW
  isPending: boolean; // ✅ Optional but useful
}

const CannabisCompanyContext =
  createContext<CannabisCompanyContextValue | null>(null);

export const useCannabisCompanies = () => {
  const ctx = useContext(CannabisCompanyContext);
  if (!ctx)
    throw new Error(
      "useCannabisCompanies must be used within a CannabisCompanyProvider"
    );
  return ctx;
};

export function CannabisCompanyProvider({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [companies, setCompanies] = useState<CompanyWithBookmark[]>([]); // ⬅️ updated
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>("All");
  const [zipFilter, setZipFilter] = useState<string>("");

  const reqRef = React.useRef(0);
  const cursorsRef = React.useRef<Record<number, string | null>>({ 1: null });
  const isZipReady = (z: string) =>
    /^\d{5}(-\d{4})?$/.test(z.trim()) || z.trim() === "";

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    cursorsRef.current = cursors;
  }, [cursors]);

  // derived (status + search + zip)
  const filteredCompanies = useMemo(() => {
    let list = companies;
    if (statusFilter !== "All") {
      const display = (s: Company["lead_status_l2"]) =>
        s === "Visited" || s === "Dropped Off" ? s : "Not Started";
      list = list.filter((c) => display(c.lead_status_l2) === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => (c.name || "").toLowerCase().includes(q));
    }
    if (zipFilter.trim()) {
      list = list.filter((c) => c.zip === zipFilter.trim());
    }
    return list;
  }, [companies, statusFilter, searchQuery, zipFilter]);

  const fetchCompaniesForPage = useCallback(
    async (pageNumber: number, afterOverride?: string) => {
      if (!userEmail) return;
      setLoading(true);
      const reqId = ++reqRef.current;

      try {
        const after =
          afterOverride !== undefined
            ? afterOverride
            : cursorsRef.current[pageNumber] ?? undefined;

        // fetch HubSpot companies + Prisma bookmark IDs in parallel
        const [{ companies: fetched, nextCursor }, bookmarkedIds] =
          await Promise.all([
            getCannabisCompaniesPaginated(
              12,
              after,
              userEmail,
              statusFilter,
              zipFilter
            ),
            getBookmarkedCompanyIds(),
          ]);

        if (reqId !== reqRef.current) return;

        const bookmarkedSet = new Set(bookmarkedIds);

        // merge the flag
        const merged: CompanyWithBookmark[] = fetched.map((c) => ({
          ...c,
          isBookmarked: bookmarkedSet.has(c.id),
        }));

        setCompanies(merged);
        setHasNextPage(!!nextCursor);
        setPage(pageNumber);
        setCursors((prev) => ({
          ...prev,
          [pageNumber + 1]: nextCursor ?? null,
        }));
      } finally {
        if (reqId === reqRef.current) setLoading(false);
      }
    },
    [userEmail, statusFilter, zipFilter]
  );

  const refreshCompanies = React.useCallback(async () => {
    setCursors({ 1: null });
    await fetchCompaniesForPage(1, undefined);
  }, [fetchCompaniesForPage]);

  const goToPage = React.useCallback(
    async (pageNumber: number) => {
      if (pageNumber === page) return;
      const after =
        pageNumber === 1
          ? undefined
          : cursorsRef.current[pageNumber] ?? undefined;
      await fetchCompaniesForPage(pageNumber, after);
    },
    [page, fetchCompaniesForPage]
  );

  const refetchCurrentPage = useCallback(async () => {
    const after =
      page === 1 ? undefined : cursorsRef.current[page] ?? undefined;
    await fetchCompaniesForPage(page, after);
  }, [page, fetchCompaniesForPage]);

  // refetch on filter/user changes (debounced for ZIP)
  useEffect(() => {
    if (!userEmail) return;

    const zip = zipFilter.trim();
    if (!isZipReady(zip)) return;

    const t = setTimeout(() => {
      setCursors({ 1: null });
      fetchCompaniesForPage(1, undefined);
    }, 300);

    return () => clearTimeout(t);
  }, [userEmail, statusFilter, zipFilter, fetchCompaniesForPage]);

  const toggleBookmark = async (companyId: string) => {
    if (pendingId) return; // prevent double click spam
    const target = companies.find((c) => c.id === companyId);
    if (!target) return;

    setPendingId(companyId);

    // optimistic flip
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, isBookmarked: !c.isBookmarked } : c
      )
    );

    try {
      await toggleCompanyBookmark(companyId, {
        legal_business_name: target.legal_business_name,
        name: target.name,
        city: target.city ?? null,
        state: target.state ?? null,
        zip: target.zip ?? null,
        lead_status_l2: target.lead_status_l2 ?? null,
      });
    } catch {
      // revert on failure
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, isBookmarked: !c.isBookmarked } : c
        )
      );
    } finally {
      setPendingId(null);
    }
  };

  const updateContact = (
    companyId: string,
    contactId: string,
    data: Partial<Company["contacts"][number]>
  ) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? {
              ...company,
              contacts: company.contacts.map((contact) =>
                contact.id === contactId ? { ...contact, ...data } : contact
              ),
            }
          : company
      )
    );
  };

  return (
    <CannabisCompanyContext.Provider
      value={{
        companies,
        filteredCompanies,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        zipFilter,
        setZipFilter,
        loading,
        page,
        goToPage,
        loadMore: () => goToPage(page + 1),
        hasNextPage,
        refreshCompanies,
        toggleBookmark,
        updateContact,
        refetchCurrentPage,
        pendingId, // ✅ NEW
        isPending, // ✅ NEW
      }}
    >
      {children}
    </CannabisCompanyContext.Provider>
  );
}
