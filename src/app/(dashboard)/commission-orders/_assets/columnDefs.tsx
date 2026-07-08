"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { CommissionOrderRowActions } from "@/app/(dashboard)/commission-orders/_components/commission-order-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { CommissionOrder } from "@/interfaces/commissionOrder";
import {
  formatCurrencyFromCents,
  formatDate,
  formatDateTime,
} from "@/utils/formatters";

export function useCommissionOrderColumns(): DataTableColumn<CommissionOrder>[] {
  const t = useTranslations("commissionOrders");
  const enumsT = useTranslations("enums");

  return useMemo<DataTableColumn<CommissionOrder>[]>(
    () => [
      {
        id: "customer",
        header: t("columnCustomer"),
        cell: (order) => order.customer?.name ?? "—",
      },
      {
        id: "orderDate",
        header: t("columnOrderDate"),
        cell: (order) => formatDate(order.order_date),
      },
      {
        id: "status",
        header: t("columnStatus"),
        cell: (order) => (
          <Badge variant="secondary">
            {enumsT(`orderStatus.${order.status}`)}
          </Badge>
        ),
      },
      {
        id: "saleTotal",
        header: t("columnSaleTotal"),
        cell: (order) => formatCurrencyFromCents(order.sale_total),
      },
      {
        id: "margin",
        header: t("columnMargin"),
        cell: (order) => formatCurrencyFromCents(order.realized_margin),
      },
      {
        id: "paid",
        header: t("columnPaid"),
        cell: (order) => (
          <Badge variant={order.is_paid ? "default" : "outline"}>
            {order.is_paid ? t("badgePaid") : t("badgeUnpaid")}
          </Badge>
        ),
      },
      {
        id: "createdAt",
        header: t("columnCreatedAt"),
        cell: (order) => formatDateTime(order.created_at),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (order) => <CommissionOrderRowActions commissionOrder={order} />,
      },
    ],
    [enumsT, t],
  );
}
