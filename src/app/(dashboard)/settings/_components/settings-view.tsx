"use client";

import { useTranslations } from "next-intl";

import { LogoCard } from "@/app/(dashboard)/settings/_components/logo-card";
import { SettingsForm } from "@/app/(dashboard)/settings/_components/settings-form";
import { useSettings } from "@/app/(dashboard)/settings/_hooks/useSettings";
import { RequirePermission } from "@/components/authorization/require-permission";
import { PageTitle } from "@/components/page-title";
import { useAuthorization } from "@/hooks/useAuthorization";

export function SettingsView() {
  const t = useTranslations("settings");
  const { can } = useAuthorization();
  const settingsQuery = useSettings({ enabled: can("atelier.manage") });
  const settings = settingsQuery.data?.data;

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle title={t("title")} description={t("description")} />

        {settingsQuery.isError ? (
          <p className="text-muted-foreground text-sm">{t("loadError")}</p>
        ) : null}

        {settings ? (
          <div className="space-y-6">
            <LogoCard settings={settings} />
            <SettingsForm settings={settings} />
          </div>
        ) : settingsQuery.isPending ? (
          <p className="text-muted-foreground text-sm">…</p>
        ) : null}
      </div>
    </RequirePermission>
  );
}
