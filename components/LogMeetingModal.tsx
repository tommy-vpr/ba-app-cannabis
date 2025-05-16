"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogMeetingForm } from "./LogMeetingForm";
import { useContactContext } from "@/context/ContactContext";

export function LogMeetingModal() {
  const { logOpen, setLogOpen, selectedContact } = useContactContext();

  if (!selectedContact) return null;

  return (
    <Dialog open={logOpen} onOpenChange={setLogOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>
            Log Meeting for {selectedContact.properties.company || "Store"}
          </DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={selectedContact.id}
          contactFirstName={selectedContact.properties.firstname}
          contactJobTitle={selectedContact.properties.jobtitle}
          contactCompany={selectedContact.properties.company}
          contactStatus={selectedContact.properties.l2_lead_status}
        />
      </DialogContent>
    </Dialog>
  );
}
