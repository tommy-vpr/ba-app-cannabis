import { NextRequest, NextResponse } from "next/server";
import { hubspotRequest } from "@/lib/hubspot/hubspotClient";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, jobTitle, companyId } =
    await req.json();

  try {
    // Step 1: Get the company's details to access its owner
    const companyRes = await hubspotRequest(
      `/crm/v3/objects/companies/${companyId}?properties=hubspot_owner_id`,
      "GET"
    );

    const ownerId = companyRes?.properties?.hubspot_owner_id;

    // Step 2: Create the contact and assign the owner
    const contactRes = await hubspotRequest(
      "/crm/v3/objects/contacts",
      "POST",
      {
        properties: {
          firstname: firstName,
          lastname: lastName,
          email,
          phone,
          jobtitle: jobTitle,
          ...(ownerId && { hubspot_owner_id: ownerId }), // Only include if exists
        },
      }
    );

    const contactId = contactRes.id;

    // Step 3: Associate the contact with the company
    await hubspotRequest(
      `/crm/v3/objects/contacts/${contactId}/associations/company/${companyId}/contact_to_company`,
      "PUT"
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error creating contact with owner:", e);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
