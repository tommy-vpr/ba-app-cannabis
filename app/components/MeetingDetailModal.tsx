// components/MeetingDetailModal.tsx
"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { ReactNode } from "react";

interface MeetingLogProp {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function MeetingLogModal({
  open,
  onClose,
  children,
}: MeetingLogProp) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <DialogPanel className="z-50 bg-white dark:bg-[#161b22] rounded-lg p-6 w-full max-w-lg border dark:border-[#30363d] shadow-xl">
        {children}
      </DialogPanel>
    </Dialog>
  );
}
