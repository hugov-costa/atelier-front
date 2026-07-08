"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useCommissionOrderColumns } from "@/app/(dashboard)/commission-orders/_assets/columnDefs";
import { CommissionOrderFormDialog } from "@/app/(dashboard)/commission-orders/_components/commission-order-form-dialog";
import { useCommissionOrders } from "@/app/(dashboard)/commission-orders/_hooks/useCommissionOrders";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListCommissionOrdersParams } from "@/interfaces/commissionOrder";
import { OrderStatus, orderStatuses } from "@/lib/enums";

const PER_PAGE = 15;
const ALL_FILTER = "all";

type StatusFilter = OrderStatus | "all";
type PaidFilter = "all" | "paid" | "unpaid";

export const COMMISSION_ORDERS_INITIAL_PARAMS: ListCommissionOrdersParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function CommissionOrdersView() {
  const t = useTranslations("commissionOrders");
  const enumsT = useTranslations("enums");
  const { can } = useAuthorization();
  const columns = useCommissionOrderColumns();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER);
  const [paid, setPaid] = useState<PaidFilter>(ALL_FILTER);

  const query = useCommissionOrders(
    {
      page,
      perPage: PER_PAGE,
      status: status === ALL_FILTER ? undefined : status,
      paid: paid === ALL_FILTER ? undefined : paid,
    },
    { enabled: can("atelier.manage") },
  );

  const onStatusChange = (value: string) => {
    setPage(1);
    setStatus(value as StatusFilter);
  };

  const onPaidChange = (value: string) => {
    setPage(1);
    setPaid(value as PaidFilter);
  };

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <CommissionOrderFormDialog
              trigger={
                <Button>
                  <Plus className="size-4" />
                  {t("new")}
                </Button>
              }
            />
          }
        />

        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterStatusAll")}</SelectItem>
              {orderStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {enumsT(`orderStatus.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paid} onValueChange={onPaidChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterPaidAll")}</SelectItem>
              <SelectItem value="paid">{t("filterPaidPaid")}</SelectItem>
              <SelectItem value="unpaid">{t("filterPaidUnpaid")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          getRowKey={(order) => order.id}
          isLoading={query.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={query.data?.meta}
          page={page}
          isFetching={query.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
