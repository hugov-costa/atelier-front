"use client";

import { useTranslations } from "next-intl";

import { AvatarCard } from "@/app/(dashboard)/account/_components/avatar-card";
import { ChangePasswordCard } from "@/app/(dashboard)/account/_components/change-password-card";
import { ProfileCard } from "@/app/(dashboard)/account/_components/profile-card";
import { TwoFactorCard } from "@/app/(dashboard)/account/_components/two-factor-card";
import { PageTitle } from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/user-context";

export default function AccountPage() {
  const t = useTranslations("account");
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("description")} />

      {user ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCard user={user} />
          <AvatarCard user={user} />
          <ChangePasswordCard />
          <TwoFactorCard />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
    </div>
  );
}
