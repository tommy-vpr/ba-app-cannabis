"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconClipboardText,
  IconUser,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { SidebarTrigger } from "@/app/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import SearchNavBar from "./SearchNavBar";

export function SiteHeader() {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();
  const pageHeader = pathname.split("/dashboard/")[1];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="sticky top-0 z-50">
      <div className="flex flex-col">
        <header className="p-[6px] bg-background dark:bg-[#06070a] flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />

            {/* Search nav bar */}
            <div className="w-full hidden md:inline-block">
              <SearchNavBar />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="sm"
                    className="rounded-full bg-gray-200 dark:bg-[#30363d] h-8 w-8 justify-center items-center cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <IconUser />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg dark:bg-[#0d1117]"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.image ?? ""}
                          alt={user?.name ?? "User"}
                        />

                        <AvatarFallback className="rounded-lg dark:bg-[#30363d]">
                          BA
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium capitalize">
                          {user?.name ?? "Unknown"}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user?.email ?? "No email"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <Link href={"/dashboard/account"}>
                      <DropdownMenuItem className="cursor-pointer">
                        <IconUserCircle />
                        Account
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="p-2 bg-gray-200 md:hidden dark:bg-[#0d1117] border-b dark:border-b-[#30363d]">
          <SearchNavBar />
        </div>
      </div>
    </div>
  );
}
