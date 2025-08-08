import { HubSpotContact } from "./hubspot";

export type Company = {
  id: string;
  name: string;
  phone: string;
  lead_status_l2: LeadStatus;
  legal_business_name: string;
  address: string | null;
  city: string | null;
  state?: string | null;
  zip?: string | null;
  county?: string | null;
  isBookmarked?: boolean;
  contacts: HubSpotContact[];
};

export type LeadStatus = "Visited" | "Dropped Off" | "" | null | undefined;

export type PaginatedCompaniesResponse = {
  results: Company[];
  paging?: {
    next?: {
      after: string;
    };
  };
};
