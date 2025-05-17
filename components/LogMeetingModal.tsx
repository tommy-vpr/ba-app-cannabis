"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogMeetingForm } from "./LogMeetingForm";
import { useContactContext } from "@/context/ContactContext";

export function LogMeetingModal({ logListRef }: { logListRef?: any }) {
  const { logOpen, setLogOpen, contactId, logContactData, fetchPage, page } =
    useContactContext();

  if (!contactId || !logContactData) return null;

  return (
    <Dialog open={logOpen} onOpenChange={setLogOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Meeting</DialogTitle>
        </DialogHeader>

        <LogMeetingForm
          contactId={contactId}
          contactFirstName={logContactData.properties?.firstname}
          contactJobTitle={logContactData.properties?.jobtitle}
          contactCompany={logContactData.properties?.company}
          contactStatus={logContactData.properties?.l2_lead_status}
          onSuccess={async (meeting) => {
            const formatted = {
              id: meeting.id || `temp-${Date.now()}`,
              properties: meeting.properties,
            };

            logListRef?.current?.addOptimisticMeeting?.(formatted);
            await fetchPage?.(page); // Refresh page to reflect new status
            setLogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
