"use client";

import { CircleCheck, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useUpdatePieceCharge } from "@/app/(dashboard)/piece-charges/_hooks/usePieceChargeMutations";
import { Button } from "@/components/ui/button";
import { PieceCharge } from "@/interfaces/pieceCharge";

export function PieceChargeRowActions({
  pieceCharge,
}: {
  pieceCharge: PieceCharge;
}) {
  const t = useTranslations("pieceCharges");
  const updatePieceCharge = useUpdatePieceCharge(pieceCharge.id);

  const toggle = () =>
    updatePieceCharge.mutate({ is_paid: !pieceCharge.is_paid });

  return (
    <div className="flex items-center justify-end">
      <Button
        variant="outline"
        size="sm"
        disabled={updatePieceCharge.isPending}
        onClick={toggle}
      >
        {pieceCharge.is_paid ? (
          <Undo2 className="size-4" />
        ) : (
          <CircleCheck className="size-4" />
        )}
        {pieceCharge.is_paid ? t("markUnpaid") : t("markPaid")}
      </Button>
    </div>
  );
}
