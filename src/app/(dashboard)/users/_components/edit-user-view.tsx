"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { StudentStatementSection } from "@/app/(dashboard)/users/_components/student-statement-section";
import { UserAuditsSection } from "@/app/(dashboard)/users/_components/user-audits-section";
import { UserEditForm } from "@/app/(dashboard)/users/_components/user-edit-form";
import { useGetUser } from "@/app/(dashboard)/users/_hooks/useGetUser";
import { PageTitle } from "@/components/page-title";
import { ErrorState } from "@/components/states/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EditUserView({ userId }: { userId: string }) {
  const t = useTranslations("users");
  const common = useTranslations("common");
  const states = useTranslations("states");
  const userQuery = useGetUser(userId);

  return (
    <div className="space-y-6">
      <PageTitle
        title={t("editTitle")}
        description={t("editDescription")}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/users">{common("back")}</Link>
          </Button>
        }
      />

      {userQuery.isPending ? (
        <div className="max-w-md space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      ) : null}

      {userQuery.isError ? (
        <ErrorState title={states("errorTitle")} description={t("loadError")} />
      ) : null}

      {userQuery.data ? <UserEditForm user={userQuery.data.data} /> : null}

      {userId.length > 0 ? <UserAuditsSection userId={userId} /> : null}

      {userQuery.data?.data.role === "user" ? (
        <StudentStatementSection userId={userId} />
      ) : null}
    </div>
  );
}
