"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { HubSpotContact } from "@/types/hubspot";
import {
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useBrand } from "@/context/BrandContext";
import { useContactContext } from "@/context/ContactContext";
import { MeetingLogList } from "@/components/MeetingLogList";
import { StatusBadgeContactDetails } from "@/components/StatusBadgeContactDetails";
import { EditContactModal } from "@/components/EditContactModal";
import { UpdateStatusModal } from "@/components/UpdateStatusModal";
import { LogMeetingModal } from "@/components/LogMeetingModal";
import type { MeetingLogListRef } from "@/types/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoDayModal } from "./DemoDayModal";
import { useDemoDayModal } from "@/context/DemoDayContext";

function getPastelColors(company?: string) {
  if (!company) return { bg: "rgb(203,213,225)", text: "rgb(100,116,139)" };
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseR = 200 + (hash % 56);
  const baseG = 200 + ((hash >> 8) % 56);
  const baseB = 200 + ((hash >> 16) % 56);
  return {
    bg: `rgb(${baseR}, ${baseG}, ${baseB})`,
    text: `rgb(${Math.max(0, baseR - 40)}, ${Math.max(
      0,
      baseG - 40
    )}, ${Math.max(0, baseB - 40)})`,
  };
}

export default function ContactPageClient({ id }: { id: string }) {
  const { brand } = useBrand();
  const {
    setSelectedContact,
    setEditOpen,
    logOpen,
    setLogOpen,
    setContactMutate,

    logListRef,
    setContactId,
    setLogContactData,
    contactId,
    logMutate,
    setLogMutate,
  } = useContactContext();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data: contact, mutate } = useSWR<HubSpotContact>(
    `/api/contacts/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: meetings = [], mutate: logMutateFn } = useSWR(
    contact?.id ? `/api/meetings/${contact.id}` : null,
    fetcher
  );

  const { setDemoOpen, setDemoContactData, demoOpen } = useDemoDayModal();

  useEffect(() => {
    setContactMutate(() => mutate);
    setLogMutate(() => logMutateFn);

    return () => {
      setContactMutate(null);
      setLogMutate(null); // ✅ this was missing inside the return
    };
  }, [mutate, logMutateFn]); // ✅ now it runs again if either changes

  // if (!contact) return <div>Loading...</div>;
  if (!contact) {
    return (
      <div className="min-h-screen h-full relative p-4 w-full max-w-[1200px] m-auto">
        <div className="flex flex-col md:flex-row rounded-md gap-8 p-6">
          <Skeleton className="h-36 w-36 rounded-full hidden md:flex bg-gray-200 dark:bg-[#212830]" />

          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-[#161b22]" />{" "}
            {/* Company name */}
            <Skeleton className="h-5 w-1/4 bg-gray-200 dark:bg-[#161b22]" />{" "}
            {/* Status badge */}
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-[#161b22]" />{" "}
            {/* Email */}
            <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-[#161b22]" />{" "}
            {/* Phone */}
            <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-[#161b22]" />{" "}
            {/* Address */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-36 bg-gray-200 dark:bg-[#161b22]" />{" "}
              {/* Edit button */}
              <Skeleton className="h-9 w-36 bg-gray-200 dark:bg-[#161b22]" />{" "}
              {/* Log meeting button */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-t bg-gray-200 dark:border-[#161b22]" />
          <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-[#161b22]" />
          <hr className="flex-grow border-t bg-gray-200 dark:border-[#161b22]" />
        </div>

        {/* <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div> */}
      </div>
    );
  }

  const { bg, text } = getPastelColors(contact?.properties?.company);

  const getInitials = (company?: string) => {
    if (!company) return "--";
    const [first = "", second = ""] = company.trim().split(" ");
    return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
  };

  const fullAddress = `${contact.properties.address}, ${contact.properties.city}, ${contact.properties.state} ${contact.properties.zip}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress
  )}`;
  const phoneLink = contact.properties.phone
    ? `tel:${contact.properties.phone}`
    : null;
  const emailLink = contact.properties.email
    ? `mailto:${contact.properties.email}`
    : null;

  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="min-h-screen h-full relative p-4 w-full max-w-[1200px] m-auto">
      <div className="shadow-md shadow-gray-200 dark:shadow-black/30 flex flex-col md:flex-row rounded-md gap-8 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]">
        <div
          className="hidden h-36 w-36 rounded-full md:flex m-auto items-center justify-center text-4xl md:text-[48px] font-bold uppercase transition-all duration-300 ease-in-out"
          style={{ backgroundColor: bg, color: text }}
        >
          {getInitials(contact?.properties?.company)}
        </div>

        <div className="flex-1">
          <h3 className="dark:text-white font-bold text-2xl uppercase">
            {contact?.properties.company}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <StatusBadgeContactDetails
              status={contact.properties.l2_lead_status || "unknown"}
            />
            <IconPencil
              className="text-gray-400 cursor-pointer"
              onClick={() => setShowStatusModal(true)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 mt-4 dark:text-gray-300">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMail size={18} />
            </div>
            {emailLink ? (
              <a href={emailLink} className="hover:underline">
                {contact.properties.email}
              </a>
            ) : (
              "N/A"
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconDeviceMobile size={18} />
            </div>
            {phoneLink ? (
              <a href={phoneLink} className="hover:underline">
                {contact.properties.phone}
              </a>
            ) : (
              "N/A"
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 dark:text-gray-300">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMapPin size={18} />
            </div>
            {contact.properties.address ? (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline capitalized"
              >
                {capitalizeWords(fullAddress.toLocaleLowerCase())}
              </a>
            ) : (
              "N/A"
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <button
              onClick={() => {
                setSelectedContact(contact);
                setEditOpen(true);
              }}
              className="cursor-pointer text-sm text-center w-full md:w-fit mt-6 px-4 py-2 border border-black hover:bg-black hover:text-white dark:border-gray-100 
              dark:bg-gray-100 dark:text-black md:dark:text-gray-100 md:dark:hover:bg-gray-100 md:dark:bg-transparent md:dark:hover:text-black rounded transition duration-200 flex items-center gap-1 justify-center"
            >
              <IconPencil size={18} /> Edit Contact
            </button>

            <button
              className={clsx(
                "text-center w-full md:w-fit group cursor-pointer text-sm mt-1 md:mt-6 px-4 py-2 border rounded transition duration-200 flex items-center justify-center gap-1",
                brand === "skwezed"
                  ? "border-[#009444] bg-[#009444] text-white"
                  : "dark:bg-green-400 border-green-400 bg-green-400 text-black md:dark:text-green-400 md:dark:bg-transparent md:dark:hover:bg-green-400 dark:hover:text-black"
              )}
              onClick={() => {
                setContactId(contact.id); // ✅ Sets ID
                setLogContactData(contact); // ✅ Sets full contact
                setLogOpen(true); // ✅ Opens modal
              }}
            >
              <span className="transition-transform duration-500 transform group-hover:rotate-[180deg]">
                <IconPlus size={18} />
              </span>
              Log Meeting
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <hr className="flex-grow border-t border-gray-200 dark:border-[#212830]" />
        <div className="text-lg font-semibold whitespace-nowrap">
          Meeting Logs
        </div>
        <hr className="flex-grow border-t border-gray-200 dark:border-[#212830]" />
      </div>

      <MeetingLogList
        ref={logListRef}
        contactId={contact.id}
        key={contact.id}
      />

      {/* <LogMeetingModal logListRef={logListRef} onSuccess={() => mutate()} /> */}

      {/* <DemoDayModal open={demoOpen} setOpen={setDemoOpen} /> */}

      <UpdateStatusModal
        open={showStatusModal}
        setOpen={setShowStatusModal}
        currentStatus={contact.properties.l2_lead_status || "assigned"}
        contactId={contact.id}
        contact={contact}
        // mutateContact={(updated, revalidate) => mutate()}
        mutateContact={(updated, revalidate) =>
          mutate(() => updated, { revalidate })
        }
      />
    </div>
  );
}
