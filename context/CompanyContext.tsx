"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Company } from "@/types/company";
import { getCannabisCompaniesPaginated } from "@/app/actions/getCannabisCompaniesPaginated";

interface CannabisCompanyContextValue {
  companies: Company[];
  loading: boolean;
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
}: {
  children: React.ReactNode;
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchCompanies = async (after: string | null = null) => {
    setLoading(true);
    try {
      const { companies: fetchedCompanies, nextCursor } =
        await getCannabisCompaniesPaginated(10, after || undefined);
      setCompanies((prev) =>
        after ? [...prev, ...fetchedCompanies] : fetchedCompanies
      );
      setAfterCursor(nextCursor);
      setHasNextPage(!!nextCursor);
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompanies = async () => {
    await fetchCompanies(null);
  };

  const loadMore = async () => {
    if (afterCursor) {
      await fetchCompanies(afterCursor);
    }
  };

  useEffect(() => {
    refreshCompanies();
  }, []);

  const toggleBookmark = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, isBookmarked: !c.isBookmarked } : c
      )
    );
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
        loading,
        loadMore,
        hasNextPage,
        refreshCompanies,
        toggleBookmark,
        updateContact,
      }}
    >
      {children}
    </CannabisCompanyContext.Provider>
  );
};
