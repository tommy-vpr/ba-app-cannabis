// app/actions/updateContact.ts
"use server";

import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";
import { EditContactFormValues } from "@/types/EditForm";

export async function updateContact(
  contactId: string,
  data: EditContactFormValues
) {
  const res = await hubspotRequest(
    `/crm/v3/objects/contacts/${contactId}`,
    "PATCH",
    {
      properties: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        jobtitle: data.jobtitle,
      },
    }
  );

  return res;
}
