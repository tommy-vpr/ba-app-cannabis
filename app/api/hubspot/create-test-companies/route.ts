import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

export async function POST() {
  try {
    const ownerId = process.env.HS_OWNER_ID; // HubSpot owner ID
    const baEmail = "tommy@cultivatedagency.com"; // Custom property value

    // Build 2 fake companies
    const inputs = Array.from({ length: 6 }, () => ({
      properties: {
        name: `Test ${faker.company.name()}`,
        legal_business_name: `Test ${faker.company.name()}`, // set legal business name
        domain: faker.internet.domainName(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        address: faker.location.streetAddress(),
        hubspot_owner_id: ownerId,
        ba_email: baEmail, // custom property
        industry: "Cannabis", // set industry
      },
    }));

    // HubSpot batch create (max 100 per request)
    const created = await hubspotRequest(
      "/crm/v3/objects/companies/batch/create",
      "POST",
      { inputs }
    );

    return NextResponse.json({ success: true, created }, { status: 200 });
  } catch (err: any) {
    console.error("Error creating test companies:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
