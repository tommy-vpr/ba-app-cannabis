// lib/swr/useContacts.ts
import useSWR from "swr";
import { fetcher } from "../fetcher";
import { HubSpotContact } from "@/types/contact";

export function useContacts({
  page = 1,
  status = "all",
  query = "",
  zip = "",
}: {
  page?: number;
  status?: string;
  query?: string;
  zip?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    status,
    query,
    zip,
  });

  const { data, error, isLoading, mutate } = useSWR<{
    contacts: HubSpotContact[];
    hasNext: boolean;
  }>(`/api/contacts?${params.toString()}`, fetcher);

  return {
    contacts: data?.contacts ?? [],
    hasNext: data?.hasNext ?? false,
    isLoading,
    error,
    mutate,
  };
}
