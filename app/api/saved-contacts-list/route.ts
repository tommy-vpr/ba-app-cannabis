import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const dynamic = "force-dynamic"; // disables caching (or use revalidate)

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ contacts: [] });
  }

  const cookieStore = await cookies(); // no await needed
  const brand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const savedContacts = await prisma.savedContact.findMany({
    where: { userId: session.user.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  const contacts: {
    id: string;
    properties: any;
    isSaved: boolean;
    dbId: string;
  }[] = [];

  for (const entry of savedContacts) {
    try {
      const contact = await getHubSpotContact(entry.contactId, brand);
      contacts.push({
        ...contact,
        isSaved: true,
        dbId: entry.id,
      });
    } catch (e: any) {
      console.warn(`❌ Error fetching ${entry.contactId}: ${e.message}`);
      if (e.message?.includes("Rate limit exceeded")) {
        await delay(1100);
        try {
          const retryContact = await getHubSpotContact(entry.contactId, brand);
          contacts.push({
            ...retryContact,
            isSaved: true,
            dbId: entry.id,
          });
        } catch (retryError: any) {
          console.warn(
            `❌ Retry failed for ${entry.contactId}: ${retryError.message}`
          );
        }
      }
    }
  }

  return NextResponse.json({
    contacts,
    hasNext: false,
    nextCursor: null,
  });
}
