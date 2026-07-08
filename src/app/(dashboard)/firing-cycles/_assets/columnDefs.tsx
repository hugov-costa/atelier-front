"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { FiringCycleRowActions } from "@/app/(dashboard)/firing-cycles/_components/firing-cycle-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { FiringCycle } from "@/interfaces/firingCycle";
import {
  formatCurrencyFromCents,
  formatDateTime,
  formatDecimal,
} from "@/utils/formatters";

export function useFiringCycleColumns(): DataTableColumn<FiringCycle>[] {
  const t = useTranslations("firingCycles");

  return useMemo<DataTableColumn<FiringCycle>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (cycle) => cycle.name,
      },
      {
        id: "cycle",
        header: t("columnCycle"),
        cell: (cycle) => String(cycle.cycle),
      },
      {
        id: "duration",
        header: t("columnDuration"),
        cell: (cycle) => t("durationValue", { minutes: cycle.duration }),
      },
      {
        id: "temperature",
        header: t("columnTemperature"),
        cell: (cycle) =>
          t("temperatureValue", { value: formatDecimal(cycle.temperature) }),
      },
      {
        id: "pricePerUnit",
        header: t("columnPricePerUnit"),
        cell: (cycle) => formatCurrencyFromCents(cycle.price_per_unit),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (cycle) => formatDateTime(cycle.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (cycle) => <FiringCycleRowActions firingCycle={cycle} />,
      },
    ],
    [t],
  );
}
