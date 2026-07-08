"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { SingleClassFormDialog } from "@/app/(dashboard)/single-classes/_components/single-class-form-dialog";
import { useDeleteSingleClass } from "@/app/(dashboard)/single-classes/_hooks/useSingleClassMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { SingleClass } from "@/interfaces/singleClass";

export function SingleClassRowActions({
  singleClass,
}: {
  singleClass: SingleClass;
}) {
  const t = useTranslations("singleClasses");
  const common = useTranslations("common");
  const deleteSingleClass = useDeleteSingleClass();

  return (
    <div className="flex items-center justify-end gap-2">
      <SingleClassFormDialog
        singleClass={singleClass}
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
        isConfirming={deleteSingleClass.isPending}
        onConfirm={() => deleteSingleClass.mutate(singleClass.id)}
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
