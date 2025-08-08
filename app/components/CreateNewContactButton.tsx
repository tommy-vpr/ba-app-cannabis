"use client";

import { useContactModal } from "@/context/ContactModalContext";
import { IconPlus } from "@tabler/icons-react";

export default function CreateNewContactButton({
  companyId,
  onContactCreated,
}: {
  companyId: string;
  onContactCreated?: (newContact: any) => void; // or HubSpotContact if typed
}) {
  const { setOpen, setCompanyId, setOnContactCreated } = useContactModal();

  return (
    <button
      onClick={() => {
        setCompanyId(companyId);
        setOnContactCreated?.(onContactCreated); // new context field
        setOpen(true);
      }}
      className="text-sm flex items-center gap-1 w-fit px-3 py-2 rounded-sm bg-blue-400 dark:text-black dark:bg-blue-500 cursor-pointer transition duration-200 hover:bg-blue-300 dark:hover:bg-blue-400"
    >
      <IconPlus size={14} />
      Create New Contact
    </button>
  );
}
