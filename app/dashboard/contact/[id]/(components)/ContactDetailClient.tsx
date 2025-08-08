"use client";

import { useState } from "react";
import MeetingLogModal from "@/app/components/MeetingDetailModal";
import MeetingCard from "./MeetingCard";
import { MeetingLog } from "@/types/contact";

type Props = {
  meetingLogs: MeetingLog[];
};

export default function ContactDetailClient({ meetingLogs }: Props) {
  const [selectedLog, setSelectedLog] = useState<MeetingLog | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meetingLogs.map((log) => (
          <MeetingCard
            key={log.id}
            log={log}
            onClick={() => setSelectedLog(log)}
          />
        ))}
      </div>

      <MeetingLogModal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      >
        {selectedLog && <MeetingCard log={selectedLog} onClick={() => {}} />}
      </MeetingLogModal>
    </>
  );
}
