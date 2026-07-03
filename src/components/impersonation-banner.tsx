"use client";

import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { useImpersonation } from "@/hooks/useImpersonation";

export function ImpersonationBanner() {
  const t = useTranslations("impersonation");
  const { user } = useUser();
  const { stopMutation } = useImpersonation();

  if (!user?.impersonated_by) {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-destructive/40 bg-destructive/10 text-foreground flex flex-wrap items-center gap-3 rounded-md border px-4 py-3 text-sm"
    >
      <ShieldAlert className="text-destructive size-5 shrink-0" />
      <span className="flex-1">{t("activeBanner", { name: user.name })}</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={stopMutation.isPending}
        onClick={() => stopMutation.mutate()}
      >
        {stopMutation.isPending ? t("stopping") : t("stop")}
      </Button>
    </div>
  );
}
