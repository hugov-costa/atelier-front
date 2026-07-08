"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { BillFormDialog } from "@/app/(dashboard)/bills/_components/bill-form-dialog";
import { useDeleteBill } from "@/app/(dashboard)/bills/_hooks/useBillMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Bill } from "@/interfaces/bill";

export function BillRowActions({ bill }: { bill: Bill }) {
  const t = useTranslations("bills");
  const common = useTranslations("common");
  const deleteBill = useDeleteBill();

  return (
    <div className="flex items-center justify-end gap-2">
      <BillFormDialog
        bill={bill}
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
        isConfirming={deleteBill.isPending}
        onConfirm={() => deleteBill.mutate(bill.id)}
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
