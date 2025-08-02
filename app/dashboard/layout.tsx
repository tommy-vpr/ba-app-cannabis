import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientSidebarWrapper } from "../components/ClientSidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSidebarWrapper>{children}</ClientSidebarWrapper>;
}
