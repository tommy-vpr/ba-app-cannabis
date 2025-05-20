"use client";

import { useState, useTransition } from "react";
import { useContactContext } from "@/context/ContactContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createNewContact } from "@/app/actions/createNewContact";
import { StatusKey } from "@/types/status";
import { CreateContactFormValues } from "@/lib/schemas";

export function useOptimisticCreateContact() {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    setQuery,
    setSelectedZip,
    setSelectedStatus,
    setPage,
    setCursors,
    setLocalQuery,
    setLocalZip,
    fetchPage,
    setStatusCounts,
  } = useContactContext();

  const createContact = async (
    values: CreateContactFormValues,
    onSuccess?: () => void,
    shouldRedirect = true,
    refetchAfterOptimistic = true
  ) => {
    setLoading(true);
    try {
      const res = await createNewContact(values);
      if (!res.success || !res.contact) throw new Error(res.message);

      const tempId = `temp-${Date.now()}`;
      const optimisticContact = {
        ...res.contact,
        id: tempId,
        optimistic: true,
      };

      // ✅ Immediately clear query params in URL (no startTransition)
      const params = new URLSearchParams();
      params.set("page", "1");
      router.replace(`/dashboard?${params.toString()}`);

      // ✅ Reset filters *after* updating the URL
      setLocalQuery("");
      setLocalZip("");
      setQuery("");
      setSelectedZip(null);
      setSelectedStatus("all");
      setPage(1);
      setCursors({});

      // ✅ Optimistically insert new contact
      await fetchPage(1, "all", "", (prev) => [optimisticContact, ...prev]);

      // ✅ Update counts
      const rawStatus = res.contact.properties.lead_status?.toLowerCase() ?? "";
      const allowedStatuses = Object.values(StatusKey);
      const leadStatus = allowedStatuses.includes(rawStatus)
        ? (rawStatus as StatusKey)
        : StatusKey.Assigned;

      setStatusCounts((prev) => ({
        ...prev,
        [StatusKey.All]: prev[StatusKey.All] + 1,
        [leadStatus]: (prev[leadStatus] ?? 0) + 1,
      }));

      // ✅ Optionally re-fetch from server
      if (refetchAfterOptimistic) {
        await fetchPage(1, "all", ""); // clean load
      }

      // ✅ Done
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  return {
    createContact,
    loading: loading || isPending,
  };
}
