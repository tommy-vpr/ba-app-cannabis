"use client";

import { useState } from "react";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { EditContactModal } from "@/app/components/EditContactModal";
import { LogMeetingModal } from "@/app/components/LogMeetingModal";
import { HubSpotContact } from "@/types/hubspot";
import { EditContactFormValues } from "@/types/EditForm";
import { EditableContact } from "@/types/contact";

export default function EditAndMeetingClient({
  contact,
}: {
  contact: EditableContact;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  const defaultEditValues: EditContactFormValues = {
    firstname: contact.firstname || "",
    lastname: contact.lastname || "",
    email: contact.email || "",
    phone: contact.phone || "",
    jobtitle: contact.jobtitle || "",
  };

  const contactName = `${contact.firstname} ${contact.lastname}`;

  return (
    <>
      <div className="flex flex-row gap-2 items-center mt-2">
        <button
          onClick={() => setEditOpen(true)}
          className="whitespace-nowrap cursor-pointer text-sm text-center w-full md:w-fit px-2 py-1 border border-black hover:bg-black hover:text-white
          dark:border-gray-100 dark:bg-gray-100 dark:text-black md:dark:text-gray-100 md:dark:hover:bg-gray-100 md:dark:bg-transparent md:dark:hover:text-black
          rounded transition duration-200 flex items-center gap-1 justify-center"
        >
          <IconPencil size={16} /> Edit Contact
        </button>

        <button
          onClick={() => setMeetingOpen(true)}
          className="whitespace-nowrap text-black dark:hover:text-black dark:text-green-400 bg-green-400 dark:bg-transparent dark:hover:bg-green-400
          text-center w-full md:w-fit group cursor-pointer text-sm px-2 py-1 border border-green-400 rounded transition duration-200 flex items-center justify-center gap-1"
        >
          <IconPlus size={18} />
          Log Meeting
        </button>
      </div>

      <EditContactModal
        open={editOpen}
        setOpen={setEditOpen}
        contactId={contact.id}
        defaultValues={defaultEditValues}
      />

      <LogMeetingModal
        open={meetingOpen}
        setOpen={setMeetingOpen}
        contactId={contact.id}
        contactName={contactName}
        contactJobTitle={contact.jobtitle}
      />
    </>
  );
}
