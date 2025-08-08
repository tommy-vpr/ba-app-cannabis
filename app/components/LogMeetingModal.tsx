"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { LogMeetingForm } from "@/app/components/LogMeetingForm"; // ✅ import the form

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contactId: string;
  contactName: string;
  contactJobTitle?: string;
  contactStatus?: string;
};

export function LogMeetingModal({
  open,
  setOpen,
  contactId,
  contactName,
  contactJobTitle,
  contactStatus,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Meeting with {contactName}</DialogTitle>
        </DialogHeader>

        {/* ✅ Use your react-hook-form-powered LogMeetingForm */}
        <LogMeetingForm
          contactId={contactId}
          contactFirstName={contactName}
          contactJobTitle={contactJobTitle}
          onSuccess={() => setOpen(false)} // ✅ close modal on success
        />
      </DialogContent>
    </Dialog>
  );
}
