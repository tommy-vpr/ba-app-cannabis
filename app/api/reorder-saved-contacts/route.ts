import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  console.log("Received reorder payload:", body);

  const { order }: { order: { id: string; position: number }[] } = body;

  if (!Array.isArray(order)) {
    return NextResponse.json(
      { success: false, message: "Invalid body" },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(
      order.map((item, i) =>
        prisma.savedContact.update({
          where: { id: item.id },
          data: { position: i }, // Confirm this field exists and is correct
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to reorder saved contacts:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
