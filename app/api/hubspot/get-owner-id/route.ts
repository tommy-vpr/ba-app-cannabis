import { NextResponse } from "next/server";
import { hubspotRequest } from "@/lib/hubspot/hubspotRequest";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const owners = await hubspotRequest("/crm/v3/owners", "GET", {
      properties: [],
    });

    const match = owners?.results?.find(
      (o: any) => o?.email?.toLowerCase?.() === email.toLowerCase()
    );

    if (!match) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ownerId: match.id,
        firstName: match.firstName,
        lastName: match.lastName,
        email: match.email,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error finding owner:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
