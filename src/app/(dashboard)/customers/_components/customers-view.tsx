"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useCustomerColumns } from "@/app/(dashboard)/customers/_assets/columnDefs";
import { CustomerFormDialog } from "@/app/(dashboard)/customers/_components/customer-form-dialog";
import { useCustomers } from "@/app/(dashboard)/customers/_hooks/useCustomers";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListCustomersParams } from "@/interfaces/customer";

const CUSTOMERS_PER_PAGE = 15;

export const CUSTOMERS_INITIAL_PARAMS: ListCustomersParams = {
  page: 1,
  perPage: CUSTOMERS_PER_PAGE,
};

export function CustomersView() {
  const t = useTranslations("customers");
  const { can } = useAuthorization();
  const columns = useCustomerColumns();
  const [page, setPage] = useState(1);

  const customersQuery = useCustomers(
    { page, perPage: CUSTOMERS_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <CustomerFormDialog
              trigger={
                <Button>
                  <Plus className="size-4" />
                  {t("new")}
                </Button>
              }
            />
          }
        />

        <DataTable
          columns={columns}
          data={customersQuery.data?.data ?? []}
          getRowKey={(customer) => customer.id}
          isLoading={customersQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={customersQuery.data?.meta}
          page={page}
          isFetching={customersQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
