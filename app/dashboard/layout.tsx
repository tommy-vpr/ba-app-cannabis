import { ClientSidebarWrapper } from "@/components/ClientSidebarWrapper";
import { ContactProvider } from "@/context/ContactContext";
import { getInitialDashboardData } from "@/app/actions/getInitialDashboardData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditContactModal } from "@/components/EditContactModal";
import { LogMeetingModal } from "@/components/LogMeetingModal";
import { SavedContactProvider } from "@/context/FetchAllSavedContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const selectedBrand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const session = await getServerSession(authOptions);
  // console.log("SESSION:", session);

  const userEmail = session?.user?.email;

  if (!userEmail || typeof userEmail !== "string" || userEmail.trim() === "") {
    console.error("Missing or invalid user email:", userEmail); // 🔍 Debug
    redirect("/login");
  }

  // ⬇️ Fetch contacts for this brand + user
  const { contacts, after, hasNext, statusCounts } =
    await getInitialDashboardData(selectedBrand, userEmail);

  // console.log(contacts.length);

  return (
    <ContactProvider
      initialContacts={contacts}
      initialCursors={{ 1: after ?? null }}
      initialHasNext={hasNext}
      initialStatusCounts={statusCounts}
    >
      <SavedContactProvider>
        <ClientSidebarWrapper>
          {children}
          <EditContactModal />
          <LogMeetingModal />
        </ClientSidebarWrapper>
      </SavedContactProvider>
    </ContactProvider>
  );
}
