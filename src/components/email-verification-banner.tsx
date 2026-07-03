"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { useResendVerificationEmail } from "@/hooks/useResendVerificationEmail";

export function EmailVerificationBanner() {
  const t = useTranslations("banner");
  const { user } = useUser();
  const resendMutation = useResendVerificationEmail();

  if (!user || user.email_verified_at) {
    return null;
  }

  return (
    <div className="border-border bg-muted flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
      <p className="text-sm">{t("emailUnverified")}</p>
      <Button
        size="sm"
        variant="outline"
        disabled={resendMutation.isPending}
        onClick={() => resendMutation.mutate()}
      >
        {resendMutation.isPending ? t("resending") : t("resend")}
      </Button>
    </div>
  );
}
