// components/nav-main.tsx
"use client";

import { Input } from "@/app/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import {
  IconAlarm,
  IconCirclePlusFilled,
  IconHome,
  IconListCheck,
  IconLocationPin,
  IconMail,
  IconSearch,
  type Icon,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import Link from "next/link";
// import { useClearFiltersAndRedirect } from "@/hooks/useClearFiltersAndRedirect";

import { useRouter } from "next/navigation";
import { BookmarkCheck } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col p-2">
        {/* 🔗 Nav Items */}
        <SidebarMenu>
          <Link
            className={clsx(
              "flex items-center gap-2 p-2 transition-colors",
              pathname === "/dashboard" &&
                "dark:bg-[#161b22] dark:border-[#30363d] border border-gray-200 bg-muted rounded-sm"
            )}
            href={"/dashboard"}
          >
            <IconHome size={18} />
            Home
          </Link>
          <Link
            href="/dashboard/priority"
            className={clsx(
              "flex items-center gap-2 p-2 transition-colors",
              pathname === "/dashboard/priority" &&
                "dark:bg-[#161b22] dark:border-[#30363d] border border-gray-200 bg-gray-100 rounded-sm"
            )}
          >
            <BookmarkCheck size={18} />
            Priority
          </Link>
          <Link
            href="/dashboard/zip-codes"
            className={clsx(
              "flex items-center gap-2 p-2 transition-colors",
              pathname === "/dashboard/zip-codes" &&
                "dark:bg-[#161b22] dark:border-[#30363d] border border-gray-200 bg-gray-100 rounded-sm"
            )}
          >
            <IconLocationPin size={18} />
            Zip Codes
          </Link>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
