// app/companies/[id]/page.tsx
import { getCompanyById } from "@/app/actions/getCompanyById";
import { notFound } from "next/navigation";

import { IconMapPin, IconPencil, IconPhone } from "@tabler/icons-react";
import CreateNewContactButton from "@/app/components/CreateNewContactButton";
import ContactCard from "./(components)/ContactCard"; // Update path as needed
import { LeadStatusBadge } from "@/app/components/LeadStatusBadge";
import { LeadStatus } from "@/types/company";

import { formatUSPhoneNumber } from "@/lib/formatPhoneNumber";
import EditCompanyModal from "@/app/components/EditCompanyModal";

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
          <h3 className="text-zinc-800 dark:text-white font-bold text-2xl uppercase">
            {company?.legal_business_name}
          </h3>

          <div className="my-3 flex items-center gap-2">
            <LeadStatusBadge status={company.lead_status_l2 as LeadStatus} />
            {/* <IconPencil className="text-gray-400 cursor-pointer" /> */}
            <EditCompanyModal company={company} />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconPhone size={18} />
            </div>
            {formatUSPhoneNumber(company.phone) ? (
              <span>{formatUSPhoneNumber(company.phone)}</span>
            ) : (
              <span className="text-gray-400 italic">Not Available</span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 dark:text-gray-300">
            <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-200 dark:bg-[#212830] dark:hover:bg-zinc-700 transition">
              <IconMapPin size={18} />
            </div>
            {fullAddress}
          </div>
        </div>
      </div>

      {company.contacts?.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-gray-200 mb-2">
            Associated Contacts
          </h2>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {company.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No associated contacts.
          </p>
        </div>
      )}

      <CreateNewContactButton companyId={company.id} />
    </div>
  );
}
