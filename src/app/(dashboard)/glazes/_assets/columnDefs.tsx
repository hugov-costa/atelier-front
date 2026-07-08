"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { GlazeRowActions } from "@/app/(dashboard)/glazes/_components/glaze-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Glaze } from "@/interfaces/glaze";
import { formatCurrencyFromCents, formatDateTime } from "@/utils/formatters";

export function useGlazeColumns(
  supplierNameById: Record<string, string>,
): DataTableColumn<Glaze>[] {
  const t = useTranslations("glazes");

  return useMemo<DataTableColumn<Glaze>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (glaze) => glaze.name,
      },
      {
        id: "supplier",
        header: t("columnSupplier"),
        cell: (glaze) => supplierNameById[glaze.glaze_supplier_id] ?? "—",
      },
      {
        id: "price",
        header: t("columnPrice"),
        cell: (glaze) => formatCurrencyFromCents(glaze.price),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (glaze) => formatDateTime(glaze.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (glaze) => <GlazeRowActions glaze={glaze} />,
      },
    ],
    [supplierNameById, t],
  );
}
