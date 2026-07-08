"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClaySupplierFormDialog } from "@/app/(dashboard)/clay-suppliers/_components/clay-supplier-form-dialog";
import { useDeleteClaySupplier } from "@/app/(dashboard)/clay-suppliers/_hooks/useClaySupplierMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ClaySupplier } from "@/interfaces/claySupplier";

export function ClaySupplierRowActions({
  claySupplier,
}: {
  claySupplier: ClaySupplier;
}) {
  const t = useTranslations("claySuppliers");
  const common = useTranslations("common");
  const deleteClaySupplier = useDeleteClaySupplier();

  return (
    <div className="flex items-center justify-end gap-2">
      <ClaySupplierFormDialog
        claySupplier={claySupplier}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: claySupplier.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteClaySupplier.isPending}
        onConfirm={() => deleteClaySupplier.mutate(claySupplier.id)}
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
