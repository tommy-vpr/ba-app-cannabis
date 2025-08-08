// app/dashboard/contact/[id]/page.tsx
import { getContactByIdWithCompanyAndMeetings } from "@/app/actions/getContactByIdWithCompanyAndMeetings";
import { notFound } from "next/navigation";
import {
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPencil,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import { FaCircleUser, FaMobile } from "react-icons/fa6";
import Link from "next/link";
import MeetingCard from "./(components)/MeetingCard";
import MeetingLogList from "./(components)/MeetingLogList";
import { BsDot } from "react-icons/bs";

import { formatUSPhoneNumber } from "@/lib/formatPhoneNumber";

import { getPastelColors } from "@/lib/getPastelColors";
import EditAndMeetingClient from "./(components)/EditAndMeetingClient";
import { MapPin } from "lucide-react";
import { LeadStatusBadge } from "@/app/components/LeadStatusBadge";

type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const { contact, company, meetings } =
    (await getContactByIdWithCompanyAndMeetings(id)) ?? {
      contact: null,
      company: null,
      meetings: [],
    };

  console.log("Editable", contact);

  if (!contact) return notFound();

  const { bg, text } = getPastelColors(contact.firstname + contact.lastname);

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="shadow-md shadow-gray-200 dark:shadow-black/30 flex flex-col md:flex-row rounded-md gap-8 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]">
        <div
          className="hidden h-36 w-36 rounded-full md:flex m-auto items-center justify-center text-4xl md:text-[48px] font-bold uppercase transition-all duration-300 ease-in-out"
          style={{ backgroundColor: bg, color: text }}
        >
          {contact.firstname?.[0] ?? "-"}
          {contact.lastname?.[0] ?? ""}
        </div>

        <div className="flex-1">
          <h3 className="leading-none mb-4 text-zinc-800 dark:text-white font-bold text-2xl flex flex-col gap-1">
            {contact.firstname} {contact.lastname}
            <span
              className="text-xs text-gray-200 flex items-center gap-1 px-3 py-1
            bg-zinc-700 rounded-4xl w-fit leading-none"
            >
              {contact.jobtitle}
            </span>
          </h3>

          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <div className="p-2 rounded-full bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconPhone size={18} />
            </div>
            {/* {contact.phone || "N/A"} */}
            {formatUSPhoneNumber(contact.phone) ? (
              <span>{formatUSPhoneNumber(contact.phone)}</span>
            ) : (
              <span className="text-gray-400 italic">Not Available</span>
            )}
          </div>

          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <div className="p-2 rounded-full bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMail size={18} />
            </div>
            {contact.email || "N/A"}
          </div>

          <EditAndMeetingClient contact={contact} />

          {/* <div className="flex flex-row gap-2 items-center mt-2">
            <button
              className="whitespace-nowrap cursor-pointer text-sm text-center w-full md:w-fit px-2 py-1 border border-black hover:bg-black hover:text-white
            dark:border-gray-100 dark:bg-gray-100 dark:text-black md:dark:text-gray-100 md:dark:hover:bg-gray-100 md:dark:bg-transparent md:dark:hover:text-black
            rounded transition duration-200 flex items-center gap-1 justify-center"
            >
              <IconPencil size={16} /> Edit Contact
            </button>

            <button
              className="whitespace-nowrap text-black dark:hover:text-black dark:text-green-400 bg-green-400 dark:bg-transparent dark:hover:bg-green-400
            text-center w-full md:w-fit group cursor-pointer text-sm px-2 py-1 border border-green-400 rounded transition duration-200 flex items-center justify-center gap-1"
            >
              <IconPlus size={18} />
              Log Meeting
            </button>
          </div> */}
        </div>
      </div>

      {/* Associated Company */}
      {company && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-blue-500 mb-2">
            Associated Company
          </h2>
          <Link href={`/dashboard/companies/${company.id}`} className="">
            <div className="relative transition duration-200 hover:-translate-y-0.5 shadow-md shadow-gray-200 dark:shadow-black/30 gap-4 border border-muted p-4 rounded-md dark:border-[#30363d] bg-white dark:bg-[#161b22]">
              <p className="mb-2 text-lg font-medium dark:text-gray-200 flex items-center gap-2">
                {company.legal_business_name}
                <LeadStatusBadge status={company.lead_status_l2} />
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <MapPin size={16} />
                {company.address}, {company.city}, {company.state} {company.zip}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Meeting Logs */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-blue-500">
            Meeting Logs
          </h2>
        </div>
        {meetings?.length > 0 ? (
          <div className="space-y-3">
            <MeetingLogList meetings={meetings} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No meetings logged yet.</p>
        )}
      </div>
    </div>
  );
}
