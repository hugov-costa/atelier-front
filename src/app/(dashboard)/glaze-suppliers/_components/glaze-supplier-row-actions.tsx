"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { GlazeSupplierFormDialog } from "@/app/(dashboard)/glaze-suppliers/_components/glaze-supplier-form-dialog";
import { useDeleteGlazeSupplier } from "@/app/(dashboard)/glaze-suppliers/_hooks/useGlazeSupplierMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { GlazeSupplier } from "@/interfaces/glazeSupplier";

export function GlazeSupplierRowActions({
  glazeSupplier,
}: {
  glazeSupplier: GlazeSupplier;
}) {
  const t = useTranslations("glazeSuppliers");
  const common = useTranslations("common");
  const deleteGlazeSupplier = useDeleteGlazeSupplier();

  return (
    <div className="flex items-center justify-end gap-2">
      <GlazeSupplierFormDialog
        glazeSupplier={glazeSupplier}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: glazeSupplier.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteGlazeSupplier.isPending}
        onConfirm={() => deleteGlazeSupplier.mutate(glazeSupplier.id)}
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
