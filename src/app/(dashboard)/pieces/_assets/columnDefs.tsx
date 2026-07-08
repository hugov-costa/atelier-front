"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { PieceRowActions } from "@/app/(dashboard)/pieces/_components/piece-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Piece } from "@/interfaces/piece";
import { formatCurrencyFromCents, formatDateTime } from "@/utils/formatters";

export function usePieceColumns(): DataTableColumn<Piece>[] {
  const t = useTranslations("pieces");
  const enumsT = useTranslations("enums");

  return useMemo<DataTableColumn<Piece>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (piece) => piece.name,
      },
      {
        id: "kind",
        header: t("columnKind"),
        cell: (piece) => (
          <Badge variant="secondary">{enumsT(`pieceKind.${piece.kind}`)}</Badge>
        ),
      },
      {
        id: "price",
        header: t("columnPrice"),
        cell: (piece) => formatCurrencyFromCents(piece.price),
      },
      {
        id: "productionCost",
        header: t("columnProductionCost"),
        cell: (piece) => formatCurrencyFromCents(piece.production_cost),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (piece) => formatDateTime(piece.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (piece) => <PieceRowActions piece={piece} />,
      },
    ],
    [enumsT, t],
  );
}
