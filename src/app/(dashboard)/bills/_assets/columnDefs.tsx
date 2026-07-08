"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { BillRowActions } from "@/app/(dashboard)/bills/_components/bill-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Bill } from "@/interfaces/bill";
import { formatCurrencyFromCents, formatDate } from "@/utils/formatters";

export function useBillColumns(): DataTableColumn<Bill>[] {
  const t = useTranslations("bills");
  const enumsT = useTranslations("enums");

  return useMemo<DataTableColumn<Bill>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (bill) => bill.name,
      },
      {
        id: "reference",
        header: t("columnReference"),
        cell: (bill) =>
          `${enumsT(`month.${bill.reference_month}`)} / ${bill.reference_year}`,
      },
      {
        id: "dueDate",
        header: t("columnDueDate"),
        cell: (bill) => formatDate(bill.due_date),
      },
      {
        id: "value",
        header: t("columnValue"),
        cell: (bill) => formatCurrencyFromCents(bill.value),
      },
      {
        id: "recurrent",
        header: t("columnRecurrent"),
        cell: (bill) => (
          <Badge variant={bill.is_recurrent ? "default" : "outline"}>
            {bill.is_recurrent ? t("badgeRecurrent") : t("badgeOneTime")}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (bill) => <BillRowActions bill={bill} />,
      },
    ],
    [enumsT, t],
  );
}
