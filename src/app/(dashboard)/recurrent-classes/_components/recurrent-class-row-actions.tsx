"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { RecurrentClassFormDialog } from "@/app/(dashboard)/recurrent-classes/_components/recurrent-class-form-dialog";
import { useDeleteRecurrentClass } from "@/app/(dashboard)/recurrent-classes/_hooks/useRecurrentClassMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { RecurrentClass } from "@/interfaces/recurrentClass";

export function RecurrentClassRowActions({
  recurrentClass,
}: {
  recurrentClass: RecurrentClass;
}) {
  const t = useTranslations("recurrentClasses");
  const common = useTranslations("common");
  const deleteRecurrentClass = useDeleteRecurrentClass();

  return (
    <div className="flex items-center justify-end gap-2">
      <RecurrentClassFormDialog
        recurrentClass={recurrentClass}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteRecurrentClass.isPending}
        onConfirm={() => deleteRecurrentClass.mutate(recurrentClass.id)}
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
