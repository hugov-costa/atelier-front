"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { PieceCategoryRowActions } from "@/app/(dashboard)/piece-categories/_components/piece-category-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { PieceCategory } from "@/interfaces/pieceCategory";
import { formatDate, formatDateTime, formatDecimal } from "@/utils/formatters";

export function usePieceCategoryColumns(): DataTableColumn<PieceCategory>[] {
  const t = useTranslations("pieceCategories");

  return useMemo<DataTableColumn<PieceCategory>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (category) => category.name,
      },
      {
        id: "profitMargin",
        header: t("columnProfitMargin"),
        cell: (category) => formatDecimal(category.profit_margin),
      },
      {
        id: "availability",
        header: t("columnAvailability"),
        cell: (category) => (
          <Badge variant={category.is_available ? "default" : "secondary"}>
            {category.is_available ? t("available") : t("unavailable")}
          </Badge>
        ),
      },
      {
        id: "availableUntil",
        header: t("columnAvailableUntil"),
        cell: (category) => formatDate(category.available_until),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (category) => formatDateTime(category.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (category) => (
          <PieceCategoryRowActions pieceCategory={category} />
        ),
      },
    ],
    [t],
  );
}
