// app/dashboard/layout.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { SiteHeader } from "@/components/site-header";
import {
  IconClipboardList,
  IconHome2,
  IconUsers,
  IconApps,
  IconNote,
  IconPlus,
} from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { EditContactModal } from "@/components/EditContactModal";
// import { Providers } from "@/components/Providers";
// import { SearchProvider } from "@/contexts/SearchContext";

export default function DashboardLayout({
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
        {/* <main className="flex flex-col gap-6 w-full bg-muted/50 h-full"> */}
        <main className="flex flex-col gap-6 w-full bg-muted/90 min-h-screen items-start justify-start">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
