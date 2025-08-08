// app/api/company/[id]/route.ts
import { getCompanyById } from "@/app/actions/getCompanyById";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const company = await getCompanyById(params.id);
  if (!company) return new NextResponse("Company not found", { status: 404 });
  return NextResponse.json(company);
}
