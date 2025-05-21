// components/nav-main.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import { useContactContext } from "@/context/ContactContext";
import { useClearFiltersAndRedirect } from "@/hooks/useClearFiltersAndRedirect";

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
  const { brand } = useBrand();
  const {
    setQuery,
    setSelectedZip,
    setSelectedStatus,
    setLocalQuery,
    setLocalZip,
    setPage,
    fetchPage,
  } = useContactContext();

  const router = useRouter();

  const handleReset = () => {
    setQuery("");
    setSelectedZip(null);
    setSelectedStatus("all");
  };

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
            onClick={async () => {
              setQuery("");
              setLocalQuery("");
              setSelectedZip(null);
              setLocalZip("");
              setSelectedStatus("all");
              setPage(1);
              router.replace(`/dashboard`);
              await fetchPage(1, "all", "");
            }}
          >
            <IconHome size={18} />
            Home
          </Link>
          <Link
            href="/dashboard/saved-contacts"
            className={clsx(
              "flex items-center gap-2 p-2 transition-colors",
              pathname === "/dashboard/saved-contacts" &&
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
          <Link
            href="/dashboard/forms"
            className={clsx(
              "flex items-center gap-2 p-2 transition-colors",
              pathname === "/dashboard/forms" &&
                "dark:bg-[#161b22] dark:border-[#30363d] border border-gray-200 bg-gray-100 rounded-sm"
            )}
          >
            <IconListCheck size={18} />
            Forms
          </Link>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
