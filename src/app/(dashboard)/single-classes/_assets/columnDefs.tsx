"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { SingleClassRowActions } from "@/app/(dashboard)/single-classes/_components/single-class-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { SingleClass } from "@/interfaces/singleClass";
import { formatCurrencyFromCents, formatDateTimeUtc } from "@/utils/formatters";

export function useSingleClassColumns(): DataTableColumn<SingleClass>[] {
  const t = useTranslations("singleClasses");

  return useMemo<DataTableColumn<SingleClass>[]>(
    () => [
      {
        id: "start",
        header: t("columnStart"),
        cell: (singleClass) => formatDateTimeUtc(singleClass.start_datetime),
      },
      {
        id: "end",
        header: t("columnEnd"),
        cell: (singleClass) => formatDateTimeUtc(singleClass.end_datetime),
      },
      {
        id: "replacement",
        header: t("columnReplacement"),
        cell: (singleClass) => (
          <Badge variant={singleClass.is_replacement ? "default" : "outline"}>
            {singleClass.is_replacement
              ? t("badgeReplacement")
              : t("badgeRegular")}
          </Badge>
        ),
      },
      {
        id: "price",
        header: t("columnPrice"),
        cell: (singleClass) => formatCurrencyFromCents(singleClass.price),
      },
      {
        id: "students",
        header: t("columnStudents"),
        cell: (singleClass) => singleClass.users?.length ?? 0,
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (singleClass) => (
          <SingleClassRowActions singleClass={singleClass} />
        ),
      },
    ],
    [t],
  );
}
