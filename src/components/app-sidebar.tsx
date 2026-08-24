"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BookMarked,
  Library,
  Search,
  Heart,
  Info,
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";
import Logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/quran", label: "القرآن الكريم", icon: BookOpen },
  { href: "/hadith", label: "الأحاديث النبوية", icon: BookMarked },
  { href: "/themes", label: "المواضيع", icon: Library },
  { href: "/search", label: "البحث", icon: Search },
  { href: "/favorites", label: "المفضلة", icon: Heart },
  { href: "/about", label: "عن المنصة", icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="border-l border-sidebar-border"
    >
      <SidebarHeader className="px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="SHK Islam"
              className="data-[active=true]:bg-transparent data-[active=true]:text-inherit"
            >
              <Link href="/">
                <Image
                  src={Logo}
                  alt="SHK Islam"
                  width={28}
                  height={28}
                  className="rounded-sm shrink-0"
                />
                <span className="font-arabic text-base font-bold">
                  SHK Islam
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button
          asChild
          variant="outline"
          className="mt-3 w-full justify-start gap-2 text-sm border-primary/40 text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-150"
        >
          <Link href="/">
            <MessageSquare className="size-4 stroke-[1.5]" />
            <span className="truncate">محادثة جديدة</span>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "text-sm transition-colors duration-150",
                        active &&
                          "border-r-2 border-sidebar-primary text-sidebar-primary bg-sidebar-accent",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4 stroke-[1.5]" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              tooltip={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
              className="text-sm"
            >
              {theme === "dark" ? (
                <Sun className="size-4 stroke-[1.5]" />
              ) : (
                <Moon className="size-4 stroke-[1.5]" />
              )}
              <span>{theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarTrigger className="text-sm w-full justify-start gap-2 [&_svg]:size-4" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
