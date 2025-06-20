// RemoveBaEmailModal.tsx
"use client";

import { useContactContext } from "@/context/ContactContext";
import { removeBaEmail } from "@/app/actions/removeBaEmail";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { useSavedContactContext } from "@/context/FetchAllSavedContext";
import { getStatusCounts } from "@/app/actions/getStatusCounts";
import { unsaveContact } from "@/app/actions/prisma/unsaveContact";
import useSWR from "swr";
import { getSavedContactIds } from "@/app/actions/prisma/getSavedContacts";
import { StatusKey } from "@/types/status";

export function RemoveBaEmailModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const {
    selectedContact,
    optimisticUpdate,
    fetchPage,
    page,
    contactMutate,
    selectedStatus,
    query,
    selectedZip,
    setStatusCounts,
    setContacts,
    contacts,
    updateContactInList,
    refreshCounts,
    statusCounts,
  } = useContactContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchAllSavedContacts } = useSavedContactContext();

  const { data: savedIds = [] } = useSWR("saved-contacts", () =>
    getSavedContactIds()
  );

  const handleConfirm = async () => {
    if (!selectedContact) return;
    setIsSubmitting(true);
    try {
      // Optimistically remove it from local list immediately
      if (contacts.length > 1) {
        setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
      } else {
        await fetchPage(page, selectedStatus, query);
      }

      await removeBaEmail(selectedContact.id, "litto-cannabis");

      if (savedIds.includes(selectedContact.id)) {
        await unsaveContact(selectedContact.id);
      }

      await fetchAllSavedContacts();

      // await refreshCounts();

      // await fetchPage(page, undefined, undefined, (prev) =>
      //   prev.filter((c) => c.id !== selectedContact.id)
      // );

      // contactMutate?.();

      const rawStatus = selectedContact?.properties?.lead_status_l2 ?? "";

      // Match it exactly to your enum (case-sensitive)
      const statusKey: StatusKey = Object.values(StatusKey).includes(
        rawStatus as StatusKey
      )
        ? (rawStatus as StatusKey)
        : StatusKey.NotStarted;

      // Decrement both "all" and the matching status
      setStatusCounts((prev) => ({
        ...prev,
        [StatusKey.All]: Math.max(0, prev[StatusKey.All] - 1),
        [statusKey]: Math.max(0, (prev[statusKey] ?? 1) - 1),
      }));

      setOpen(false);
    } catch (err) {
      console.error("Failed to remove BA email:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !selectedContact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-[#161b22] dark:border dark:border-[#30363d] rounded-xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">Confirm Removal</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to remove this contact from your list?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer transition duration-200 text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-[#161b22]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="cursor-pointer transition duration-200 text-sm px-4 py-2 rounded-md bg-rose-400 text-white hover:bg-rose-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="4" /> : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
