// app/dashboard/layout.tsx
import { ClientSidebarWrapper } from "@/components/ClientSidebarWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSidebarWrapper>{children}</ClientSidebarWrapper>;
}
