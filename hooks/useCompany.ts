import useSWR from "swr";
import { getCompanyById } from "@/app/actions/getCompanyById";
import { Company } from "@/types/company";

export function useCompany(
  id: string | null,
  options?: { fallbackData?: Company }
) {
  return useSWR<Company>(
    id ? `/company/${id}` : null,
    async () => {
      const data = await getCompanyById(id!);
      if (!data) throw new Error("Company not found");
      return data;
    },
    options
  );
}
