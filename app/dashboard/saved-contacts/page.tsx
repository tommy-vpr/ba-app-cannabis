import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { notFound } from "next/navigation";
import { SavedContactsPageClient } from "@/components/SavedContactsPageClient";

export default async function SavedContactsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return notFound();

  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Contacts</h1>
      <SavedContactsPageClient />
    </div>
  );
}
