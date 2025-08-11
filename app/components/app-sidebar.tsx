"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/app/components/ui/sidebar";
import { NavUser } from "@/app/components/nav-user";
import Image from "next/image";
import Link from "next/link";
// import { useContactContext } from "@/context/ContactContext";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();

  const isZipContactRoute = /^\/dashboard\/(contacts|zipcodes)\/[^/]+$/.test(
    pathname
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 dark:bg-[#06070a]">
        <Link href="/dashboard">
          <Image
            src="/images/litto-logo-blk.webp"
            width={100}
            height={50}
            alt="logo"
            className="dark:invert"
            quality={100}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className={`gap-0 dark:bg-[#06070a]`}>
        {children}
        <AnimatePresence mode="wait">
          <motion.div
            key={isZipContactRoute ? "zip-link-list" : "zipcode-filter"}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Zipcodes list */}
          </motion.div>
        </AnimatePresence>
      </SidebarContent>

      <SidebarFooter className={`dark:bg-[#06070a]`}>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
