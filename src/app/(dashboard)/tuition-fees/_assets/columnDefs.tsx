"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { TuitionFeeRowActions } from "@/app/(dashboard)/tuition-fees/_components/tuition-fee-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { TuitionFee } from "@/interfaces/tuitionFee";
import { formatCurrencyFromCents, formatDate } from "@/utils/formatters";

interface UseTuitionFeeColumnsOptions {
  studentNames: Map<string, string>;
}

export function useTuitionFeeColumns({
  studentNames,
}: UseTuitionFeeColumnsOptions): DataTableColumn<TuitionFee>[] {
  const t = useTranslations("tuitionFees");

  return useMemo<DataTableColumn<TuitionFee>[]>(
    () => [
      {
        id: "student",
        header: t("columnStudent"),
        cell: (fee) => studentNames.get(fee.enrollment_id) ?? "—",
      },
      {
        id: "amount",
        header: t("columnAmount"),
        cell: (fee) => formatCurrencyFromCents(fee.amount),
      },
      {
        id: "dueDate",
        header: t("columnDueDate"),
        cell: (fee) => formatDate(fee.due_date),
      },
      {
        id: "status",
        header: t("columnStatus"),
        cell: (fee) => (
          <Badge variant={fee.is_paid ? "default" : "outline"}>
            {fee.is_paid ? t("badgePaid") : t("badgeUnpaid")}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (fee) => <TuitionFeeRowActions tuitionFee={fee} />,
      },
    ],
    [studentNames, t],
  );
}
