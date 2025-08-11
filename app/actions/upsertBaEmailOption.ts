// app/actions/upsertBaEmailOption.ts
import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

const OBJECT = "companies";
const PROPERTY = "ba_email";

type HubSpotPropertyOption = {
  label: string;
  value: string;
  hidden?: boolean;
  description?: string | null;
  displayOrder?: number;
};

type HubSpotProperty = {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  options: HubSpotPropertyOption[];
};

export async function upsertBaEmailOption(email: string) {
  let prop: HubSpotProperty;

  // 1) Get or create the property
  try {
    prop = await hubspotRequest(
      `/crm/v3/properties/${OBJECT}/${PROPERTY}`,
      "GET"
    );
  } catch {
    // Create the property if missing
    prop = await hubspotRequest(`/crm/v3/properties/${OBJECT}`, "POST", {
      name: PROPERTY,
      label: "BA Email",
      type: "enumeration",
      fieldType: "select",
      groupName: "companyinformation",
      options: [],
      hidden: false,
      displayOrder: -1,
    });
  }

  // 2) Skip if already exists
  if (prop.options?.some((o) => o.value === email)) return;

  // 3) Merge + PATCH full list of options
  const updatedOptions: HubSpotPropertyOption[] = [
    ...(prop.options ?? []),
    { label: email, value: email, hidden: false },
  ];

  try {
    await hubspotRequest(`/crm/v3/properties/${OBJECT}/${PROPERTY}`, "PATCH", {
      options: updatedOptions,
    });
  } catch (e: any) {
    // Handle race conditions: if another request already added it, skip error
    const latest: HubSpotProperty = await hubspotRequest(
      `/crm/v3/properties/${OBJECT}/${PROPERTY}`,
      "GET"
    );
    if (!latest.options?.some((o) => o.value === email)) throw e;
  }
}
