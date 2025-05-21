import { getContactById } from "@/app/actions/getContactById";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the promise
  const cookieStore = await cookies(); // no await needed
  const brand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const contact = await getContactById(id, brand);

  if (!contact) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(contact);
}
