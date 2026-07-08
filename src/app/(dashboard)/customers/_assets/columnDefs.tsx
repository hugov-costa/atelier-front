"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { CustomerRowActions } from "@/app/(dashboard)/customers/_components/customer-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Customer } from "@/interfaces/customer";
import { formatDateTime } from "@/utils/formatters";

export function useCustomerColumns(): DataTableColumn<Customer>[] {
  const t = useTranslations("customers");

  return useMemo<DataTableColumn<Customer>[]>(
    () => [
      {
        id: "name",
        header: t("columnName"),
        cell: (customer) => customer.name,
      },
      {
        id: "email",
        header: t("columnEmail"),
        cell: (customer) => customer.email ?? "—",
      },
      {
        id: "phone",
        header: t("columnPhone"),
        cell: (customer) => customer.phone ?? "—",
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (customer) => formatDateTime(customer.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (customer) => <CustomerRowActions customer={customer} />,
      },
    ],
    [t],
  );
}
