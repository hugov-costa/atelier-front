"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { FiringCycleFormDialog } from "@/app/(dashboard)/firing-cycles/_components/firing-cycle-form-dialog";
import { useDeleteFiringCycle } from "@/app/(dashboard)/firing-cycles/_hooks/useFiringCycleMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { FiringCycle } from "@/interfaces/firingCycle";

export function FiringCycleRowActions({
  firingCycle,
}: {
  firingCycle: FiringCycle;
}) {
  const t = useTranslations("firingCycles");
  const common = useTranslations("common");
  const deleteFiringCycle = useDeleteFiringCycle();

  return (
    <div className="flex items-center justify-end gap-2">
      <FiringCycleFormDialog
        firingCycle={firingCycle}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: firingCycle.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteFiringCycle.isPending}
        onConfirm={() => deleteFiringCycle.mutate(firingCycle.id)}
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
