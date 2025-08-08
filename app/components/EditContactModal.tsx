"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { EditContactForm } from "@/app/components/EditContactForm";

import { EditContactFormValues } from "@/types/EditForm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contactId: string;
  defaultValues: EditContactFormValues;
};

export function EditContactModal({
  open,
  setOpen,
  contactId,
  defaultValues,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <EditContactForm
          contactId={contactId}
          defaultValues={defaultValues}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
