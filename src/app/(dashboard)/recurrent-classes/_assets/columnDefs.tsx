"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { RecurrentClassRowActions } from "@/app/(dashboard)/recurrent-classes/_components/recurrent-class-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { RecurrentClass } from "@/interfaces/recurrentClass";
import { formatTime } from "@/utils/formatters";

export function useRecurrentClassColumns(): DataTableColumn<RecurrentClass>[] {
  const t = useTranslations("recurrentClasses");
  const enumsT = useTranslations("enums");

  return useMemo<DataTableColumn<RecurrentClass>[]>(
    () => [
      {
        id: "day",
        header: t("columnDay"),
        cell: (recurrentClass) => (
          <Badge variant="secondary">
            {enumsT(`dayOfWeek.${recurrentClass.day_of_the_week}`)}
          </Badge>
        ),
      },
      {
        id: "time",
        header: t("columnTime"),
        cell: (recurrentClass) =>
          `${formatTime(recurrentClass.start_time)} – ${formatTime(recurrentClass.end_time)}`,
      },
      {
        id: "students",
        header: t("columnStudents"),
        cell: (recurrentClass) => recurrentClass.users?.length ?? 0,
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (recurrentClass) => (
          <RecurrentClassRowActions recurrentClass={recurrentClass} />
        ),
      },
    ],
    [enumsT, t],
  );
}
