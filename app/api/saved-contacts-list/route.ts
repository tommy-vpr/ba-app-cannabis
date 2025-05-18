// /app/api/saved-contacts-list/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ contacts: [] });

  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  const savedContacts = await prisma.savedContact.findMany({
    where: { userId: session.user.id },
  });

  const contacts = await Promise.all(
    savedContacts.map(async (entry) => {
      try {
        const contact = await getHubSpotContact(entry.contactId, brand);
        return { ...contact, isSaved: true };
      } catch (e) {
        return null;
      }
    })
  );

  const filtered = contacts.filter(Boolean);
  return NextResponse.json({ contacts: filtered });
}
