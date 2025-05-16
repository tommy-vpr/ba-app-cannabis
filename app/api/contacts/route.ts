// app/api/contacts/route.ts
import { NextResponse } from "next/server";
import { getContacts } from "@/app/actions/getContacts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const status = searchParams.get("status") ?? "all";
  const query = searchParams.get("query") ?? "";
  const zip = searchParams.get("zip") ?? "";

  const result = await getContacts({ page, status, query, zip }, "litto");

  return NextResponse.json(result);
}
