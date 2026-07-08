"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

import { accountNavigationItem, navigationGroups } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/contexts/user-context";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useLogout } from "@/hooks/useLogout";

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const t = useTranslations("navigation");
  const common = useTranslations("common");
  const pathname = usePathname();
  const { user } = useUser();
  const { can } = useAuthorization();
  const logoutMutation = useLogout();

  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || can(item.permission),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 text-lg font-semibold">
        Serv Front
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.labelKey ?? `group-${groupIndex}`}>
            {group.labelKey ? (
              <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveRoute(pathname, item.href)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{t(item.titleKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActiveRoute(pathname, accountNavigationItem.href)}
            >
              <Link href={accountNavigationItem.href}>
                <accountNavigationItem.icon />
                <span>{user?.name ?? t(accountNavigationItem.titleKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="size-4" />
          {common("logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
