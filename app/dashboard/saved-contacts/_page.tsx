import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ContactCard } from "@/components/ContactCard";
import { notFound } from "next/navigation";
import { getHubSpotContact } from "@/lib/hubspot/getHubSpotContact";
import { cookies } from "next/headers"; // ✅ server-side cookies

export default async function SavedContactsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return notFound();

  // ✅ Get selected brand from cookie
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
        return await getHubSpotContact(entry.contactId, brand);
      } catch (e) {
        console.error("❌ Failed to fetch contact", entry.contactId);
        return null;
      }
    })
  );

  const filteredContacts = contacts.filter(Boolean);

  const savedIds = savedContacts.map((entry) => entry.contactId); // ✅ get saved contact IDs

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Contacts</h1>

      {filteredContacts.length === 0 ? (
        <p className="text-gray-500">You have no saved contacts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={{ ...contact, isSaved: savedIds.includes(contact.id) }}
              href={contact.id}
              savedIds={savedIds} // ✅ correct way to pass it
            />
          ))}
        </div>
      )}
    </div>
  );
}
