// app/api/test-hubspot/route.ts
import { getCannabisCompaniesWithContacts } from "@/app/actions/getCompaniesWithContacts";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getCannabisCompaniesWithContacts(); // userEmail unused for now
  return NextResponse.json(result);
}
