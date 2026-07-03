"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { UserRowActions } from "@/app/(dashboard)/users/_components/user-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/interfaces/user";
import { formatDateTime } from "@/utils/formatters";

const roleLabelKeys: Record<UserRole, "roleUser" | "roleAdmin" | "roleMaster"> =
  {
    user: "roleUser",
    admin: "roleAdmin",
    master: "roleMaster",
  };

export function useUserColumns(): DataTableColumn<User>[] {
  const t = useTranslations("users");

  return useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (user) => user.name,
        sortable: true,
        sortKey: "name",
      },
      {
        id: "email",
        header: t("columnEmail"),
        cell: (user) => user.email,
        sortable: true,
        sortKey: "email",
      },
      {
        id: "role",
        header: t("columnRole"),
        cell: (user) => {
          const role: UserRole = user.role ?? "user";

          return (
            <Badge variant={role === "user" ? "secondary" : "default"}>
              {t(roleLabelKeys[role])}
            </Badge>
          );
        },
      },
      {
        id: "status",
        header: t("columnStatus"),
        cell: (user) => {
          const isVerified = Boolean(user.email_verified_at);

          return (
            <Badge variant={isVerified ? "default" : "secondary"}>
              {isVerified ? t("statusVerified") : t("statusPending")}
            </Badge>
          );
        },
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (user) => formatDateTime(user.created_at),
        sortable: true,
        sortKey: "created_at",
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (user) => <UserRowActions user={user} />,
      },
    ],
    [t],
  );
}
