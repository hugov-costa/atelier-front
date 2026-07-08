import {
  BarChart3,
  Bell,
  Boxes,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  CircleDollarSign,
  Contact,
  Flame,
  Gem,
  GraduationCap,
  LayoutDashboard,
  Palette,
  Receipt,
  Repeat,
  ScrollText,
  Settings,
  Shapes,
  Truck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Permission } from "@/lib/authorization";

export interface NavigationItem {
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  titleKey: string;
}

export interface NavigationGroup {
  items: NavigationItem[];
  labelKey?: string;
}

export const navigationGroups: NavigationGroup[] = [
  {
    items: [
      { titleKey: "home", href: "/", icon: LayoutDashboard },
      {
        titleKey: "users",
        href: "/users",
        icon: Users,
        permission: "users.view",
      },
      {
        titleKey: "audits",
        href: "/audits",
        icon: ScrollText,
        permission: "audits.view",
      },
      {
        titleKey: "notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    labelKey: "catalog",
    items: [
      {
        titleKey: "claySuppliers",
        href: "/clay-suppliers",
        icon: Truck,
        permission: "atelier.manage",
      },
      {
        titleKey: "clays",
        href: "/clays",
        icon: Boxes,
        permission: "atelier.manage",
      },
      {
        titleKey: "glazeSuppliers",
        href: "/glaze-suppliers",
        icon: Truck,
        permission: "atelier.manage",
      },
      {
        titleKey: "glazes",
        href: "/glazes",
        icon: Palette,
        permission: "atelier.manage",
      },
      {
        titleKey: "pieceCategories",
        href: "/piece-categories",
        icon: Shapes,
        permission: "atelier.manage",
      },
      {
        titleKey: "firingCycles",
        href: "/firing-cycles",
        icon: Flame,
        permission: "atelier.manage",
      },
      {
        titleKey: "materialPurchases",
        href: "/material-purchases",
        icon: Receipt,
        permission: "atelier.manage",
      },
    ],
  },
  {
    labelKey: "production",
    items: [
      {
        titleKey: "pieces",
        href: "/pieces",
        icon: Gem,
        permission: "atelier.manage",
      },
      {
        titleKey: "commissionOrders",
        href: "/commission-orders",
        icon: ClipboardList,
        permission: "atelier.manage",
      },
      {
        titleKey: "pieceCharges",
        href: "/piece-charges",
        icon: CircleDollarSign,
        permission: "atelier.manage",
      },
      {
        titleKey: "customers",
        href: "/customers",
        icon: Contact,
        permission: "atelier.manage",
      },
    ],
  },
  {
    labelKey: "classes",
    items: [
      {
        titleKey: "singleClasses",
        href: "/single-classes",
        icon: CalendarClock,
        permission: "atelier.manage",
      },
      {
        titleKey: "recurrentClasses",
        href: "/recurrent-classes",
        icon: Repeat,
        permission: "atelier.manage",
      },
      {
        titleKey: "enrollments",
        href: "/enrollments",
        icon: GraduationCap,
        permission: "atelier.manage",
      },
    ],
  },
  {
    labelKey: "finance",
    items: [
      {
        titleKey: "bills",
        href: "/bills",
        icon: Wallet,
        permission: "atelier.manage",
      },
      {
        titleKey: "tuitionFees",
        href: "/tuition-fees",
        icon: CalendarCheck,
        permission: "atelier.manage",
      },
      {
        titleKey: "reports",
        href: "/reports",
        icon: BarChart3,
        permission: "reports.view",
      },
    ],
  },
  {
    labelKey: "config",
    items: [
      {
        titleKey: "settings",
        href: "/settings",
        icon: Settings,
        permission: "atelier.manage",
      },
    ],
  },
];

export const accountNavigationItem: NavigationItem = {
  titleKey: "account",
  href: "/account",
  icon: UserCog,
};

export const breadcrumbSegmentKeys: Record<string, string> = {
  account: "account",
  audits: "audits",
  bills: "bills",
  clays: "clays",
  "clay-suppliers": "claySuppliers",
  "commission-orders": "commissionOrders",
  customers: "customers",
  enrollments: "enrollments",
  "firing-cycles": "firingCycles",
  glazes: "glazes",
  "glaze-suppliers": "glazeSuppliers",
  "material-purchases": "materialPurchases",
  notifications: "notifications",
  "piece-categories": "pieceCategories",
  "piece-charges": "pieceCharges",
  pieces: "pieces",
  "recurrent-classes": "recurrentClasses",
  reports: "reports",
  settings: "settings",
  "single-classes": "singleClasses",
  "tuition-fees": "tuitionFees",
  users: "users",
};
