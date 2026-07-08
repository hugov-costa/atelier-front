"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useClaySupplierColumns } from "@/app/(dashboard)/clay-suppliers/_assets/columnDefs";
import { ClaySupplierFormDialog } from "@/app/(dashboard)/clay-suppliers/_components/clay-supplier-form-dialog";
import { useClaySuppliers } from "@/app/(dashboard)/clay-suppliers/_hooks/useClaySuppliers";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListClaySuppliersParams } from "@/interfaces/claySupplier";

const CLAY_SUPPLIERS_PER_PAGE = 15;

export const CLAY_SUPPLIERS_INITIAL_PARAMS: ListClaySuppliersParams = {
  page: 1,
  perPage: CLAY_SUPPLIERS_PER_PAGE,
};

export function ClaySuppliersView() {
  const t = useTranslations("claySuppliers");
  const { can } = useAuthorization();
  const columns = useClaySupplierColumns();
  const [page, setPage] = useState(1);

  const claySuppliersQuery = useClaySuppliers(
    { page, perPage: CLAY_SUPPLIERS_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <ClaySupplierFormDialog
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
          data={claySuppliersQuery.data?.data ?? []}
          getRowKey={(supplier) => supplier.id}
          isLoading={claySuppliersQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={claySuppliersQuery.data?.meta}
          page={page}
          isFetching={claySuppliersQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
