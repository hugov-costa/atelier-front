"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClayFormDialog } from "@/app/(dashboard)/clays/_components/clay-form-dialog";
import { useDeleteClay } from "@/app/(dashboard)/clays/_hooks/useClayMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Clay } from "@/interfaces/clay";

export function ClayRowActions({ clay }: { clay: Clay }) {
  const t = useTranslations("clays");
  const common = useTranslations("common");
  const deleteClay = useDeleteClay();

  return (
    <div className="flex items-center justify-end gap-2">
      <ClayFormDialog
        clay={clay}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: clay.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteClay.isPending}
        onConfirm={() => deleteClay.mutate(clay.id)}
        trigger={
          <Button variant="outline" size="sm">
            <Trash2 className="size-4" />
            {common("delete")}
          </Button>
        }
      />
    </div>
  );
}
