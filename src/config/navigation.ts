import { LayoutDashboard, ScrollText, UserCog, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Permission } from "@/lib/authorization";

export interface NavigationItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

export const primaryNavigation: NavigationItem[] = [
  { titleKey: "home", href: "/", icon: LayoutDashboard },
  { titleKey: "users", href: "/users", icon: Users, permission: "users.view" },
  {
    titleKey: "audits",
    href: "/audits",
    icon: ScrollText,
    permission: "audits.view",
  },
];

export const accountNavigationItem: NavigationItem = {
  titleKey: "account",
  href: "/account",
  icon: UserCog,
};

export const breadcrumbSegmentKeys: Record<string, string> = {
  users: "users",
  audits: "audits",
  account: "account",
};
