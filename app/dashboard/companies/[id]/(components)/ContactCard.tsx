"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconDeviceMobile,
  IconMail,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { FaCircleUser } from "react-icons/fa6";
import { LogMeetingModal } from "@/app/components/LogMeetingModal";
import type { HubSpotContact } from "@/types/hubspot";
import { formatUSPhoneNumber } from "@/lib/formatPhoneNumber";

import { EditContactModal } from "@/app/components/EditContactModal"; // import this
import { EditContactFormValues } from "@/types/EditForm"; // for typing

type Props = {
  contact: HubSpotContact;
};

export default function ContactCard({ contact }: Props) {
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const defaultEditValues: EditContactFormValues = {
    firstname: contact.properties.firstname || "",
    lastname: contact.properties.lastname || "",
    email: contact.properties.email || "",
    phone: contact.properties.phone || "",
    jobtitle: contact.properties.jobtitle || "",
  };

  console.log("CONTACT", contact);

  const contactName = `${contact.properties.firstname} ${contact.properties.lastname}`;

  return (
    <>
      <Link href={`/dashboard/contact/${contact.id}`}>
        <div
          className="h-full flex flex-col md:flex-row shadow-md shadow-gray-200 dark:shadow-black/30 rounded-md gap-4 p-6 border border-muted
        dark:border-[#30363d] bg-white dark:bg-[#161b22] hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-4">
              <div className="flex justify-center">
                <FaCircleUser className="text-[54px] text-gray-300 dark:text-gray-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h3>{contactName}</h3>
                <ul className="space-y-0.5">
                  <li className="text-zinc-800 dark:text-blue-400 flex items-center gap-1 text-sm">
                    <IconDeviceMobile size={16} />

                    {formatUSPhoneNumber(contact.properties.phone) ? (
                      <span>
                        {formatUSPhoneNumber(contact.properties.phone)}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No phone</span>
                    )}
                  </li>
                  <li className="text-zinc-800 dark:text-blue-400 flex items-center gap-1 text-sm">
                    <IconMail size={16} />
                    {contact.properties.email ?? "N/A"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-row gap-2 items-center mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setEditOpen(true);
                }}
                className="cursor-pointer text-sm px-2 py-1 border border-black hover:bg-black hover:text-white
                dark:border-gray-100 dark:bg-gray-100 dark:text-black md:dark:text-gray-100 md:dark:hover:bg-gray-100 
                  md:dark:bg-transparent md:dark:hover:text-black
                  rounded transition duration-200 flex items-center gap-1 justify-center"
              >
                <IconPencil size={16} /> Edit Contact
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setMeetingOpen(true);
                }}
                className="whitespace-nowrap text-black dark:hover:text-black dark:text-green-400 bg-green-400 dark:bg-transparent dark:hover:bg-green-400
              text-center group cursor-pointer text-sm px-2 py-1 border border-green-400 rounded transition duration-200 flex items-center justify-center gap-1"
              >
                <IconPlus size={18} />
                Log Meeting
              </button>
            </div>
          </div>
        </div>
      </Link>

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
        contactJobTitle={contact.properties.jobtitle}
      />
    </>
  );
}
