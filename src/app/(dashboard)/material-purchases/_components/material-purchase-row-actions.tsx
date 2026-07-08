"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { MaterialPurchaseFormDialog } from "@/app/(dashboard)/material-purchases/_components/material-purchase-form-dialog";
import { useDeleteMaterialPurchase } from "@/app/(dashboard)/material-purchases/_hooks/useMaterialPurchaseMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { MaterialPurchase } from "@/interfaces/materialPurchase";

export function MaterialPurchaseRowActions({
  materialPurchase,
}: {
  materialPurchase: MaterialPurchase;
}) {
  const t = useTranslations("materialPurchases");
  const common = useTranslations("common");
  const deleteMaterialPurchase = useDeleteMaterialPurchase();

  return (
    <div className="flex items-center justify-end gap-2">
      <MaterialPurchaseFormDialog
        materialPurchase={materialPurchase}
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
        isConfirming={deleteMaterialPurchase.isPending}
        onConfirm={() => deleteMaterialPurchase.mutate(materialPurchase.id)}
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
