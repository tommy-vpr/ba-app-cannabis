"use client";

import { SidebarProvider, SidebarInset } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { NavMain } from "@/app/components/nav-main";
import { SiteHeader } from "@/app/components/site-header";
import { IconHome2 } from "@tabler/icons-react";

export function ClientSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [{ title: "Home", url: "/dashboard", icon: IconHome2 }];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar>
        <NavMain items={navItems} />
      </AppSidebar>

      <SidebarInset>
        <SiteHeader
          user={{
            name: "Tommy",
            email: "tommy@example.com",
            avatar: "",
          }}
        />
        <main className="flex flex-col gap-6 w-full bg-muted/90 dark:bg-[#0d1117] min-h-screen items-start justify-start">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
