"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Company } from "@/types/company";
import { getCannabisCompaniesPaginated } from "@/app/actions/getCannabisCompaniesPaginated";

interface CannabisCompanyContextValue {
  companies: Company[];
  filteredCompanies: Company[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  page: number;
  goToPage: (page: number) => Promise<void>;
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  refreshCompanies: () => Promise<void>;
  toggleBookmark: (companyId: string) => void;
  updateContact: (
    companyId: string,
    contactId: string,
    data: Partial<Company["contacts"][number]>
  ) => void;
}

const CannabisCompanyContext =
  createContext<CannabisCompanyContextValue | null>(null);

export const useCannabisCompanies = () => {
  const context = useContext(CannabisCompanyContext);
  if (!context) {
    throw new Error(
      "useCannabisCompanies must be used within a CannabisCompanyProvider"
    );
  }
  return context;
};

export const CannabisCompanyProvider = ({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    1: null,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  const fetchCompaniesForPage = async (pageNumber: number) => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const after = cursors[pageNumber] ?? null;
      const { companies: fetchedCompanies, nextCursor } =
        await getCannabisCompaniesPaginated(12, after || undefined, userEmail);

      setCompanies(fetchedCompanies);
      setHasNextPage(!!nextCursor);
      setPage(pageNumber);

      if (nextCursor) {
        setCursors((prev) => ({
          ...prev,
          [pageNumber + 1]: nextCursor,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompanies = async () => {
    setCursors({ 1: null });
    await fetchCompaniesForPage(1);
  };

  const goToPage = async (pageNumber: number) => {
    if (pageNumber === page) return;
    await fetchCompaniesForPage(pageNumber);
  };

  useEffect(() => {
    if (!userEmail) return;
    fetchCompaniesForPage(1);
  }, [userEmail]); // Only run when userEmail becomes available

  const toggleBookmark = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, isBookmarked: !c.isBookmarked } : c
      )
    );
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCompanies([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches = companies.filter((c) => c.name.toLowerCase().includes(q));

    setFilteredCompanies(matches);
  }, [searchQuery, companies]);

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
        loading,
        loadMore: () => goToPage(page + 1),
        hasNextPage,
        refreshCompanies,
        toggleBookmark,
        updateContact,
        page,
        goToPage,
        searchQuery,
        setSearchQuery,
        filteredCompanies,
      }}
    >
      {children}
    </CannabisCompanyContext.Provider>
  );
};
