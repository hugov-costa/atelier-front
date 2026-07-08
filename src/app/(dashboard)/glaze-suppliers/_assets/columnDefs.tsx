"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { GlazeSupplierRowActions } from "@/app/(dashboard)/glaze-suppliers/_components/glaze-supplier-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { GlazeSupplier } from "@/interfaces/glazeSupplier";
import { formatDateTime } from "@/utils/formatters";

export function useGlazeSupplierColumns(): DataTableColumn<GlazeSupplier>[] {
  const t = useTranslations("glazeSuppliers");

  return useMemo<DataTableColumn<GlazeSupplier>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (supplier) => supplier.name,
      },
      {
        id: "email",
        header: t("columnEmail"),
        cell: (supplier) => supplier.email,
      },
      {
        id: "phone",
        header: t("columnPhone"),
        cell: (supplier) => supplier.phone,
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (supplier) => formatDateTime(supplier.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (supplier) => (
          <GlazeSupplierRowActions glazeSupplier={supplier} />
        ),
      },
    ],
    [t],
  );
}
