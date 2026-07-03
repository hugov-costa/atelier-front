"use client";

import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { PageTitle } from "@/components/page-title";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Permission } from "@/lib/authorization";

interface RequirePermissionProps {
  permission: Permission;
  title: string;
  children: ReactNode;
}

export function RequirePermission({
  permission,
  title,
  children,
}: RequirePermissionProps) {
  const t = useTranslations("authorization");
  const { can } = useAuthorization();

  if (!can(permission)) {
    return (
      <div className="space-y-6">
        <PageTitle title={title} />
        <p className="text-muted-foreground text-sm">{t("denied")}</p>
      </div>
    );
  }

  return <>{children}</>;
}
