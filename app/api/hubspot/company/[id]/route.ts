// app/api/company/[id]/route.ts
import { getCompanyById } from "@/app/actions/getCompanyById";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const company = await getCompanyById(id);
  if (!company) return new NextResponse("Company not found", { status: 404 });
  return NextResponse.json(company);
}
