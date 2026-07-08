"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { MaterialPurchaseRowActions } from "@/app/(dashboard)/material-purchases/_components/material-purchase-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { MaterialPurchase } from "@/interfaces/materialPurchase";
import {
  formatCurrencyFromCents,
  formatDate,
  formatDecimal,
} from "@/utils/formatters";

export function useMaterialPurchaseColumns(): DataTableColumn<MaterialPurchase>[] {
  const t = useTranslations("materialPurchases");
  const enumsT = useTranslations("enums");

  return useMemo<DataTableColumn<MaterialPurchase>[]>(
    () => [
      {
        id: "material",
        header: t("columnMaterial"),
        cell: (purchase) => (
          <div className="flex items-center gap-2">
            <span>{purchase.material.name ?? "—"}</span>
            <Badge variant="secondary">
              {enumsT(`materialType.${purchase.material.type}`)}
            </Badge>
          </div>
        ),
      },
      {
        id: "supplier",
        header: t("columnSupplier"),
        cell: (purchase) => purchase.supplier.name ?? "—",
      },
      {
        id: "quantity",
        header: t("columnQuantity"),
        cell: (purchase) => formatDecimal(purchase.quantity),
      },
      {
        id: "totalPrice",
        header: t("columnTotalPrice"),
        cell: (purchase) => formatCurrencyFromCents(purchase.total_price),
      },
      {
        id: "paymentMethod",
        header: t("columnPaymentMethod"),
        cell: (purchase) => enumsT(`paymentMethod.${purchase.payment_method}`),
      },
      {
        id: "status",
        header: t("columnStatus"),
        cell: (purchase) => (
          <Badge variant={purchase.is_received ? "default" : "secondary"}>
            {purchase.is_received ? t("statusReceived") : t("statusPending")}
          </Badge>
        ),
      },
      {
        id: "purchaseDate",
        header: t("columnPurchaseDate"),
        cell: (purchase) => formatDate(purchase.purchase_date),
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (purchase) => (
          <MaterialPurchaseRowActions materialPurchase={purchase} />
        ),
      },
    ],
    [enumsT, t],
  );
}
