import { ClientSidebarWrapper } from "@/components/ClientSidebarWrapper";
import { ContactProvider } from "@/context/ContactContext";
import { getInitialDashboardData } from "@/app/actions/getInitialDashboardData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditContactModal } from "@/components/EditContactModal";
import { LogMeetingModal } from "@/components/LogMeetingModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const selectedBrand = (cookieStore.get("selected_brand")?.value ??
    "litto-cannabis") as "litto-cannabis" | "skwezed";

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) redirect("/login");

  // ⬇️ Fetch contacts for this brand + user
  const { contacts, after, hasNext, statusCounts } =
    await getInitialDashboardData(selectedBrand, userEmail);

  console.log(contacts.length);

  return (
    <ContactProvider
      initialContacts={contacts}
      initialCursors={{ 1: after ?? null }}
      initialHasNext={hasNext}
      initialStatusCounts={statusCounts}
    >
      <ClientSidebarWrapper>
        {children}
        <EditContactModal />
        <LogMeetingModal />
      </ClientSidebarWrapper>
    </ContactProvider>
  );
}
