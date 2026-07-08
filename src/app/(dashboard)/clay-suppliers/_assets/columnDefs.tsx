"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { ClaySupplierRowActions } from "@/app/(dashboard)/clay-suppliers/_components/clay-supplier-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { ClaySupplier } from "@/interfaces/claySupplier";
import { formatDateTime } from "@/utils/formatters";

export function useClaySupplierColumns(): DataTableColumn<ClaySupplier>[] {
  const t = useTranslations("claySuppliers");

  return useMemo<DataTableColumn<ClaySupplier>[]>(
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
        cell: (supplier) => <ClaySupplierRowActions claySupplier={supplier} />,
      },
    ],
    [t],
  );
}
