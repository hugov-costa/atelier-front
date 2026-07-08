"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { ClayRowActions } from "@/app/(dashboard)/clays/_components/clay-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Clay } from "@/interfaces/clay";
import { formatCurrencyFromCents, formatDateTime } from "@/utils/formatters";

export function useClayColumns(
  supplierNameById: Record<string, string>,
): DataTableColumn<Clay>[] {
  const t = useTranslations("clays");

  return useMemo<DataTableColumn<Clay>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (clay) => clay.name,
      },
      {
        id: "supplier",
        header: t("columnSupplier"),
        cell: (clay) => supplierNameById[clay.clay_supplier_id] ?? "—",
      },
      {
        id: "price",
        header: t("columnPrice"),
        cell: (clay) => formatCurrencyFromCents(clay.price),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (clay) => formatDateTime(clay.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (clay) => <ClayRowActions clay={clay} />,
      },
    ],
    [supplierNameById, t],
  );
}
