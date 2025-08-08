"use client";

import { useState } from "react";
import MeetingCard from "./MeetingCard"; // adjust path if needed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"; // using ShadCN dialog

type Meeting = {
  id: string;
  title: string;
  notes?: string;
  createdAt: string;
};

type Props = {
  meetings: Meeting[];
};

export default function MeetingLogList({ meetings }: Props) {
  const [selectedLog, setSelectedLog] = useState<Meeting | null>(null);

  return (
    <>
      <div className="space-y-3">
        {meetings.map((log) => (
          <MeetingCard
            key={log.id}
            log={log}
            onClick={() => setSelectedLog(log)}
          />
        ))}
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLog?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {new Date(selectedLog?.createdAt ?? "").toLocaleString()}
            </p>
            <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {selectedLog?.notes || "No notes provided."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
