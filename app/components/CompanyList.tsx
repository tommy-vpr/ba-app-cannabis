"use client";

import { Company } from "@/types/company";
import { useEffect, useState } from "react";
import { getCannabisCompaniesWithContacts } from "@/app/actions/getCompaniesWithContacts";

import { MapPin } from "lucide-react";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await getCannabisCompaniesWithContacts(); // pass userEmail if needed in the action
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {companies.map((company) => (
        <div key={company.id} className="border rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold">{company.legal_business_name}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>
              <MapPin size={14} />
            </span>{" "}
            <span>
              {company.address}, {company.city}, {company.zip} {company.state}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};
