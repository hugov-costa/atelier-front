"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { CommissionOrderFormDialog } from "@/app/(dashboard)/commission-orders/_components/commission-order-form-dialog";
import { useDeleteCommissionOrder } from "@/app/(dashboard)/commission-orders/_hooks/useCommissionOrderMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { CommissionOrder } from "@/interfaces/commissionOrder";

export function CommissionOrderRowActions({
  commissionOrder,
}: {
  commissionOrder: CommissionOrder;
}) {
  const t = useTranslations("commissionOrders");
  const common = useTranslations("common");
  const deleteCommissionOrder = useDeleteCommissionOrder();

  return (
    <div className="flex items-center justify-end gap-2">
      <CommissionOrderFormDialog
        commissionOrder={commissionOrder}
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
        isConfirming={deleteCommissionOrder.isPending}
        onConfirm={() => deleteCommissionOrder.mutate(commissionOrder.id)}
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
