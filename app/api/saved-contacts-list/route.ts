// /app/api/saved-contacts-list/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ contacts: [] });

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "12", 10);
  const after = url.searchParams.get("after");

  const cookieStore = await cookies(); // no await needed
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  const savedContacts = await prisma.savedContact.findMany({
    where: { userId: session.user.id },
    take: limit + 1, // fetch 1 extra to check if there's a next page
    skip: after ? 1 : 0,
    cursor: after ? { id: after } : undefined,
    orderBy: { id: "asc" },
  });

  const hasNext = savedContacts.length > limit;
  const pageContacts = hasNext ? savedContacts.slice(0, limit) : savedContacts;

  const contacts: any[] = [];

  for (const entry of pageContacts) {
    try {
      const contact = await getHubSpotContact(entry.contactId, brand);
      contacts.push({ ...contact, isSaved: true });
    } catch (e: any) {
      if (e.message?.includes("Rate limit exceeded")) {
        await delay(1100);
        try {
          const retryContact = await getHubSpotContact(entry.contactId, brand);
          contacts.push({ ...retryContact, isSaved: true });
        } catch (retryError: any) {
          console.warn(
            "❌ Retry failed for",
            entry.contactId,
            retryError.message
          );
        }
      } else {
        console.warn("❌ Failed to fetch", entry.contactId, e.message);
      }
    }
  }

  const nextCursor = hasNext ? savedContacts[limit].id : null;

  return NextResponse.json({
    contacts,
    hasNext,
    nextCursor,
  });
}

// // /app/api/saved-contacts-list/route.ts
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { prisma } from "@/lib/prisma";
// import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) return NextResponse.json({ contacts: [] });

//   const cookieStore = await cookies();
//   const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
//     | "litto"
//     | "skwezed";

//   const cursor = req.nextUrl.searchParams.get("after");
//   const limit = 12;

//   const savedContacts = await prisma.savedContact.findMany({
//     where: { userId: session.user.id },
//     take: limit + 1,
//     ...(cursor && { skip: 1, cursor: { id: cursor } }),
//     orderBy: { id: "asc" },
//   });

//   const nextCursor =
//     savedContacts.length > limit ? savedContacts.pop()?.id : null;

//   const contacts: any[] = [];
//   for (const entry of savedContacts) {
//     try {
//       const contact = await getHubSpotContact(entry.contactId, brand);
//       contacts.push({ ...contact, isSaved: true });
//     } catch (e: any) {
//       if (e.message?.includes("Rate limit exceeded")) {
//         await delay(1100);
//         try {
//           const retry = await getHubSpotContact(entry.contactId, brand);
//           contacts.push({ ...retry, isSaved: true });
//         } catch (err: any) {
//           console.warn("Retry failed for", entry.contactId);
//         }
//       } else {
//         console.error("Failed to fetch contact:", entry.contactId);
//       }
//     }
//   }

//   return NextResponse.json({ contacts, nextCursor });
// }

// // /app/api/saved-contacts-list/route.ts

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { prisma } from "@/lib/prisma";
// import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ contacts: [] });
//   }

//   const cookieStore = await cookies(); // No need for await
//   const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
//     | "litto"
//     | "skwezed";

//   // Get saved contact IDs for the current user
//   const savedContacts = await prisma.savedContact.findMany({
//     where: { userId: session.user.id },
//   });

//   const contacts = [];

//   for (const { contactId } of savedContacts) {
//     try {
//       const contact = await getHubSpotContact(contactId, brand);
//       contacts.push({ ...contact, isSaved: true });
//     } catch (err: any) {
//       const msg = err?.message || "Unknown error";
//       if (msg.includes("Rate limit exceeded")) {
//         console.warn(
//           `⚠️ Rate limited on ${contactId}. Retrying after delay...`
//         );
//         await delay(1100); // wait ~1s before retry

//         try {
//           const retry = await getHubSpotContact(contactId, brand);
//           contacts.push({ ...retry, isSaved: true });
//         } catch (retryErr: any) {
//           console.error(
//             `❌ Retry failed for ${contactId}: ${retryErr.message}`
//           );
//         }
//       } else {
//         console.error(`❌ Failed to fetch ${contactId}: ${msg}`);
//       }
//     }
//   }

//   return NextResponse.json({ contacts });
// }
