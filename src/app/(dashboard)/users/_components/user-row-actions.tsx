"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eraser, Pencil, Trash2 } from "lucide-react";

import { useDeleteUserMutation } from "@/app/(dashboard)/users/_hooks/useDeleteUserMutation";
import { useEraseUserMutation } from "@/app/(dashboard)/users/_hooks/useEraseUserMutation";
import { ImpersonateDialog } from "@/app/(dashboard)/users/_components/impersonate-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { useAuthorization } from "@/hooks/useAuthorization";
import { User } from "@/interfaces/user";

export function UserRowActions({ user }: { user: User }) {
  const t = useTranslations("users");
  const common = useTranslations("common");
  const deleteUserMutation = useDeleteUserMutation();
  const eraseUserMutation = useEraseUserMutation();
  const { isMaster } = useAuthorization();
  const { user: currentUser } = useUser();

  const isSelf = user.id === currentUser?.id;
  const canManage = isMaster && !isSelf;
  const canImpersonate = isMaster && user.role !== "master" && !isSelf;

  return (
    <div className="flex items-center justify-end gap-2">
      {canImpersonate ? <ImpersonateDialog user={user} /> : null}

      <Button asChild variant="outline" size="sm">
        <Link href={`/users/${user.id}`}>
          <Pencil className="size-4" />
          {t("actionEdit")}
        </Link>
      </Button>

      {canManage ? (
        <>
          <ConfirmDialog
            title={t("deleteTitle")}
            description={t("deleteDescription", { name: user.name })}
            confirmLabel={t("deleteConfirm")}
            cancelLabel={common("cancel")}
            isConfirming={deleteUserMutation.isPending}
            onConfirm={() => deleteUserMutation.mutate(user.id)}
            trigger={
              <Button variant="outline" size="sm">
                <Trash2 className="size-4" />
                {t("actionDelete")}
              </Button>
            }
          />

          <ConfirmDialog
            title={t("eraseTitle")}
            description={t("eraseDescription", { name: user.name })}
            confirmLabel={t("eraseConfirm")}
            cancelLabel={common("cancel")}
            isConfirming={eraseUserMutation.isPending}
            onConfirm={() => eraseUserMutation.mutate(user.id)}
            trigger={
              <Button variant="destructive" size="sm">
                <Eraser className="size-4" />
                {t("actionErase")}
              </Button>
            }
          />
        </>
      ) : null}
    </div>
  );
}
