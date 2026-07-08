"use client";

import { CircleCheck, Trash2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  useDeleteTuitionFee,
  useUpdateTuitionFee,
} from "@/app/(dashboard)/tuition-fees/_hooks/useTuitionFeeMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TuitionFee } from "@/interfaces/tuitionFee";

export function TuitionFeeRowActions({
  tuitionFee,
}: {
  tuitionFee: TuitionFee;
}) {
  const t = useTranslations("tuitionFees");
  const common = useTranslations("common");
  const updateTuitionFee = useUpdateTuitionFee(tuitionFee.id);
  const deleteTuitionFee = useDeleteTuitionFee();

  const toggle = () =>
    updateTuitionFee.mutate({ is_paid: !tuitionFee.is_paid });

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={updateTuitionFee.isPending}
        onClick={toggle}
      >
        {tuitionFee.is_paid ? (
          <Undo2 className="size-4" />
        ) : (
          <CircleCheck className="size-4" />
        )}
        {tuitionFee.is_paid ? t("markUnpaid") : t("markPaid")}
      </Button>

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteTuitionFee.isPending}
        onConfirm={() => deleteTuitionFee.mutate(tuitionFee.id)}
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
