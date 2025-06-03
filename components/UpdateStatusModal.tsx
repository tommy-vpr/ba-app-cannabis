"use client";

import { useEffect, useState } from "react";
import { updateL2LeadStatus } from "@/app/actions/updateL2LeadStatus";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { HubSpotContact } from "@/types/hubspot";
import { useBrand } from "@/context/BrandContext";
import { useContactContext } from "@/context/ContactContext";
import { getStatusCounts } from "@/app/actions/getStatusCounts";
import { useSession } from "next-auth/react";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentStatus: string;
  contactId: string;
  contact: HubSpotContact;
  refetchContact?: () => Promise<HubSpotContact | null>;
  mutateContact?: (data?: HubSpotContact, shouldRevalidate?: boolean) => void;
  setLocalContact?: (c: HubSpotContact) => void;
};

const statuses = ["Visited", "Dropped Off"] as const;

export function UpdateStatusModal({
  open,
  setOpen,
  currentStatus,
  contactId,
  contact,
  refetchContact,
  mutateContact,
  setLocalContact,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null); // no default selection
  const { brand } = useBrand();
  const { updateContactInList, setStatusCounts } = useContactContext();

  const { data: session } = useSession();

  useEffect(() => {
    if (open) setSelected(null); // reset every time modal opens
  }, [open]);

  const handleUpdate = async () => {
    if (!contactId || !contact || !selected) {
      toast.error("Please select a status before saving");
      return;
    }

    setLoading(true);

    const updatedContact: HubSpotContact = {
      ...contact,
      properties: {
        ...contact.properties,
        lead_status_l2: selected,
      },
    };

    mutateContact?.(updatedContact, false);
    setLocalContact?.(updatedContact);
    updateContactInList(updatedContact);

    const res = await updateL2LeadStatus(contactId, selected, brand);

    if (res.success) {
      toast.success("Status updated");
      const refreshed = await refetchContact?.();
      if (refreshed) {
        mutateContact?.(refreshed, false);
        setLocalContact?.(refreshed);
        updateContactInList(refreshed);
      }

      const newCounts = await getStatusCounts(brand, session?.user.email ?? "");
      setStatusCounts(newCounts);
      setOpen(false);
    } else {
      toast.error(res.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="status"
                value={status}
                checked={selected === status}
                onChange={() => setSelected(status)}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center peer-checked:border-green-400 peer-checked:bg-green-400">
                <div className="w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 bg-white" />
              </div>
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>

        <Button
          onClick={handleUpdate}
          disabled={loading || !selected}
          className="w-full"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
