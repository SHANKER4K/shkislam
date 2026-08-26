"use client";

import { ChevronsUpDown, LogOut, ShieldCheck, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth, useSession } from "@better-auth-ui/react";
import type { AppAuthClient } from "@/lib/auth-client";

import { UserAvatar } from "@/components/auth/user/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarProfile() {
  const router = useRouter();
  const { authClient } = useAuth<AppAuthClient>();
  const { data: session } = useSession(authClient);
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!user) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="تسجيل الدخول" className="text-sm">
          <Link href="/auth/sign-in">
            <UserRound className="size-4 stroke-[1.5]" />
            <span>تسجيل الدخول</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            tooltip={user.name || user.email || "حسابي"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar />
            <div className="grid flex-1 leading-tight text-start">
              <span className="truncate text-sm font-medium">
                {user.name || "حسابي"}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {user.email}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 stroke-[1.5]" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="left"
          align="start"
          className="min-w-52 rounded-lg"
        >
          <DropdownMenuLabel className="text-sm font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-start">
              <UserAvatar />
              <div className="grid flex-1 leading-tight">
                <span className="truncate font-medium">
                  {user.name || "حسابي"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/settings/account">
                <UserRound className="size-4 stroke-[1.5]" />
                الملف الشخصي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/security">
                <ShieldCheck className="size-4 stroke-[1.5]" />
                الأمان
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin/users">
                  <Users className="size-4 stroke-[1.5]" />
                  إدارة المستخدمين
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              authClient
                .signOut({})
                .then(() => {
                  router.push("/");
                  router.refresh();
                })
                .catch(() => router.refresh()) // stay signed in, refresh state
            }
            variant="destructive"
          >
            <LogOut className="size-4 stroke-[1.5]" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
