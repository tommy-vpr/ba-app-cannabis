"use client";

import { HubSpotContact, HubSpotContactWithSaved } from "@/types/hubspot";
import { useContactContext } from "@/context/ContactContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import {
  IconArrowsSort,
  IconCheck,
  IconCircleDashedCheck,
  IconListNumbers,
  IconPencil,
  IconTextPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { unsaveContact } from "@/app/actions/prisma/unsaveContact";
import { saveContact } from "@/app/actions/prisma/saveContact";

export function ContactCard({
  contact,
  href,
  savedIds,
  mutateSavedIds,
  index,
  onReorder,
}: {
  contact: HubSpotContactWithSaved;
  href: string;
  savedIds: string[];
  mutateSavedIds?: () => void;
  index?: number;
  onReorder?: (id: string, newIndex: number) => void;
}) {
  const [showSelect, setShowSelect] = useState(false);

  const [isSaved, setIsSaved] = useState(savedIds.includes(contact.id));

  useEffect(() => {
    setIsSaved(savedIds.includes(contact.id));
  }, [savedIds, contact.id]);

  const toggleSaved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      await unsaveContact(contact.id);
      setIsSaved(false);
      mutateSavedIds?.(); // ✅ remove from UI list
    } else {
      await saveContact(contact.id);
      setIsSaved(true);
      // ⛔️ don't call mutateSavedIds here — let SWR revalidate passively if needed
    }
  };

  const {
    setEditOpen,
    setSelectedContact,
    setContactId,
    setLogContactData,
    setLogOpen,
  } = useContactContext();

  const router = useRouter();

  const {
    email,
    phone,
    company,
    city,
    address,
    state,
    zip,
    hs_lead_status,
    l2_lead_status,
  } = contact.properties;

  const safeId = encodeURIComponent(contact.id ?? "");
  const validL2Statuses = ["assigned", "visited", "dropped off"];
  const showBadge =
    hs_lead_status === "Samples" &&
    validL2Statuses.includes(l2_lead_status ?? "");

  const fullAddress = `${contact.properties.address || "-"}, ${
    contact.properties.city || "-"
  }`;

  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleReorderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newIndex = parseInt(e.target.value, 10) - 1;
    onReorder?.(contact.id, newIndex);
    setShowSelect(false); // hide after selection
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSelect((prev) => !prev);
  };

  return (
    <>
      <Card
        onClick={() => router.push(`/dashboard/contacts/${safeId}`)}
        // className="hover:shadow-lg transition-shadow h-full flex flex-col gap-0 dark:bg-muted/50"
        className="relative shadow-md shadow-gray-200 dark:shadow-black/30 hover:shadow-lg transition-shadow h-full flex flex-col gap-0 dark:bg-[#161b22] dark:border dark:border-[#30363d]"
      >
        {index && (
          <div
            className="z-10 absolute top-2 left-2 text-xs font-mono h-6 w-6 rounded-full
          bg-gray-400 text-white border-[2px] border-white dark:border-[#161b22] dark:bg-blue-500 dark:text-gray-100 flex items-center justify-center"
          >
            {index}
          </div>
        )}
        <div className="cursor-pointer flex-grow">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="font-bold uppercase text-md bg-gray-100 dark:bg-[#30363d] text-zinc-700 dark:text-gray-100 p-3 rounded">
              {company || "-"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" /> {email || "-"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" /> {phone || "-"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />{" "}
              {capitalizeWords(fullAddress.toLocaleLowerCase())}, {state || "-"}{" "}
              {zip || "-"}
            </div>
            {showBadge && <StatusBadge status={l2_lead_status || "unknown"} />}
          </CardContent>
        </div>

        {index && (
          <div
            className="absolute top-2 right-2 text-gray-400 bg-gray-200 border-white dark:bg-[#30363d] dark:text-gray-200 h-7 w-7 rounded-md border-[2px] dark:border-[#161b22] flex justify-center items-center"
            onClick={handleMoreClick}
          >
            <IconArrowsSort className="w-5 h-4 cursor-pointer" />
            {onReorder && index !== undefined && showSelect && (
              <select
                className="absolute top-6 right-0 bg-white dark:bg-[#1c1c1c] text-sm border rounded z-10"
                value={index}
                onChange={handleReorderChange}
                onClick={(e) => e.stopPropagation()}
              >
                {Array.from({ length: savedIds.length }).map((_, i) => (
                  <option key={i} value={i + 1}>
                    Move to {i + 1}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="flex gap-1 px-4 pb-4">
          <button
            className="text-sm cursor-pointer flex items-center gap-1 p-2 text-green-400 hover:underline underline-offset-4"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedContact(contact);
              setEditOpen(true);
            }}
          >
            <IconPencil size={18} /> Edit
          </button>

          <button
            className="text-sm cursor-pointer flex items-center gap-1 p-2 text-gray-500 dark:text-[#4493f8] hover:underline underline-offset-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              setContactId(contact.id); // ✅ Sets ID
              setLogContactData(contact); // ✅ Sets full contact
              setLogOpen(true);
            }}
          >
            <IconTextPlus size={18} /> Log Meeting
          </button>

          {contact.properties.l2_lead_status === "dropped off" ? (
            <span className="text-sm flex items-center gap-1 p-2 text-[#4493f8] ml-auto">
              <IconCheck size={21} />
            </span>
          ) : (
            <button
              className="text-sm cursor-pointer flex items-center gap-1 p-2 text-gray-400 hover:underline 
            underline-offset-4 ml-auto"
              onClick={toggleSaved}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={18} className="text-amber-300" /> Saved
                </>
              ) : (
                <>
                  <Bookmark size={18} /> Save
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
