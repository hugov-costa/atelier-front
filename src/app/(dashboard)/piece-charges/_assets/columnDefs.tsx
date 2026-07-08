"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { PieceChargeRowActions } from "@/app/(dashboard)/piece-charges/_components/piece-charge-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { PieceCharge } from "@/interfaces/pieceCharge";
import { formatCurrencyFromCents, formatDate } from "@/utils/formatters";

interface UsePieceChargeColumnsOptions {
  pieceNames: Map<string, string>;
  userNames: Map<string, string>;
}

export function usePieceChargeColumns({
  pieceNames,
  userNames,
}: UsePieceChargeColumnsOptions): DataTableColumn<PieceCharge>[] {
  const t = useTranslations("pieceCharges");

  return useMemo<DataTableColumn<PieceCharge>[]>(
    () => [
      {
        id: "piece",
        header: t("columnPiece"),
        cell: (charge) => pieceNames.get(charge.piece_id) ?? "—",
      },
      {
        id: "student",
        header: t("columnStudent"),
        cell: (charge) => userNames.get(charge.user_id) ?? "—",
      },
      {
        id: "amount",
        header: t("columnAmount"),
        cell: (charge) => formatCurrencyFromCents(charge.amount),
      },
      {
        id: "dueDate",
        header: t("columnDueDate"),
        cell: (charge) => formatDate(charge.due_date),
      },
      {
        id: "status",
        header: t("columnStatus"),
        cell: (charge) => (
          <Badge variant={charge.is_paid ? "default" : "outline"}>
            {charge.is_paid ? t("badgePaid") : t("badgeUnpaid")}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (charge) => <PieceChargeRowActions pieceCharge={charge} />,
      },
    ],
    [pieceNames, t, userNames],
  );
}
