// app/companies/[id]/page.tsx
import { getCompanyById } from "@/app/actions/getCompanyById";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";

import {
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";

type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

function getPastelColors(company?: string) {
  if (!company) return { bg: "rgb(240, 240, 240)", text: "rgb(120, 120, 120)" };

  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate pastel by keeping high RGB values, but varied slightly
  const baseR = 220 + (hash % 30); // range: 220–249
  const baseG = 220 + ((hash >> 8) % 30); // range: 220–249
  const baseB = 220 + ((hash >> 16) % 30); // range: 220–249

  return {
    bg: `rgb(${baseR}, ${baseG}, ${baseB})`,
    text: `rgb(${Math.max(50, baseR - 100)}, ${Math.max(
      50,
      baseG - 100
    )}, ${Math.max(50, baseB - 100)})`, // Ensure text contrast
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;

  const company = await getCompanyById(id);

  if (!company) return notFound();

  const getInitials = (company?: string) => {
    if (!company) return "--";
    const [first = "", second = ""] = company.trim().split(" ");
    return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
  };

  const { bg, text } = getPastelColors(company?.legal_business_name);

  const fullAddress = (
    <>
      {company.address}, {company.city}, {company.state} {company.zip}
    </>
  );

  return (
    <div className="w-full max-w-[900px] mx-auto p-6 space-y-6">
      <div className="shadow-md shadow-gray-200 dark:shadow-black/30 flex flex-col md:flex-row rounded-md gap-8 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]">
        <div
          className="hidden h-36 w-36 rounded-full md:flex m-auto items-center justify-center text-4xl md:text-[48px] 
        font-bold uppercase transition-all duration-300 ease-in-out"
          style={{ backgroundColor: bg, color: text }}
        >
          {getInitials(company?.legal_business_name)}
        </div>

        <div className="flex-1">
          <h3 className="dark:text-white font-bold text-2xl uppercase">
            {company?.legal_business_name}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <div className="mt-2 px-3 py-1 rounded-full w-fit text-xs border border-blue-400 text-blue-400">
              Not Started
            </div>
            <IconPencil className="text-gray-400 cursor-pointer" />
          </div>

          {/* Email */}
          {/* <div className="flex items-center gap-2 mt-4 dark:text-gray-300">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMail size={18} />
            </div>
          </div> */}

          {/* Phone */}
          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconDeviceMobile size={18} />
            </div>
            888.555.999
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 dark:text-gray-300">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMapPin size={18} />
            </div>
            {fullAddress}
          </div>

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <button
              className="cursor-pointer text-sm text-center w-full md:w-fit mt-6 px-4 py-2 border border-black hover:bg-black hover:text-white dark:border-gray-100 
              dark:bg-gray-100 dark:text-black md:dark:text-gray-100 md:dark:hover:bg-gray-100 md:dark:bg-transparent md:dark:hover:text-black rounded transition duration-200 flex items-center gap-1 justify-center"
            >
              <IconPencil size={18} /> Edit Contact
            </button>

            <button
              className="text-black md:dark:text-green-400 md:dark:bg-transparent md:dark:hover:bg-green-400 dark:hover:text-black text-center w-full md:w-fit group 
            cursor-pointer text-sm mt-1 md:mt-6 px-4 py-2 border border-green-400 rounded transition duration-200 flex items-center justify-center gap-1"
            >
              <span className="transition-transform duration-500 transform group-hover:rotate-[180deg]">
                <IconPlus size={18} />
              </span>
              Log Meeting
            </button>
          </div>
        </div>
      </div>

      {/* <h1 className="text-3xl font-bold text-gray-100">
        {company.legal_business_name}
      </h1>
      <p className="text-gray-400 flex items-center gap-2">
        <MapPin size={16} />
        {company.address}, {company.city}, {company.state} {company.zip}
      </p> */}

      {/* <div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">
          Company Info
        </h2>
        <ul className="text-gray-300 space-y-1">
          <li>
            <strong>Name:</strong> {company.name}
          </li>
          <li>
            <strong>Legal Name:</strong> {company.legal_business_name}
          </li>
          <li>
            <strong className="text-green-500">Address:</strong>{" "}
            {company.address}
          </li>
          <li>
            <strong>City:</strong> {company.city}
          </li>
          <li>
            <strong>State:</strong> {company.state}
          </li>
          <li>
            <strong>ZIP:</strong> {company.zip}
          </li>
          <li>
            <strong>County:</strong> {company.county}
          </li>
        </ul>
      </div> */}

      {company.contacts?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            Associated Contacts
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.contacts.map((contact) => (
              <li
                key={contact.id}
                className="h-full flex flex-col md:flex-row shadow-md shadow-gray-200 dark:shadow-black/30 rounded-md gap-4 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]"
              >
                <FaCircleUser size={24} />
                <div className="flex">
                  <div className="flex flex-col gap-2">
                    <h3>
                      {contact.properties.firstname}{" "}
                      {contact.properties.lastname}
                    </h3>
                    <span className="text-blue-400 flex items-center gap-1 text-sm">
                      <IconMail size={16} />
                      {contact.properties.email
                        ? contact.properties.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
