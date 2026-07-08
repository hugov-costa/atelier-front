"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useGlazeSupplierColumns } from "@/app/(dashboard)/glaze-suppliers/_assets/columnDefs";
import { GlazeSupplierFormDialog } from "@/app/(dashboard)/glaze-suppliers/_components/glaze-supplier-form-dialog";
import { useGlazeSuppliers } from "@/app/(dashboard)/glaze-suppliers/_hooks/useGlazeSuppliers";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListGlazeSuppliersParams } from "@/interfaces/glazeSupplier";

const GLAZE_SUPPLIERS_PER_PAGE = 15;

export const GLAZE_SUPPLIERS_INITIAL_PARAMS: ListGlazeSuppliersParams = {
  page: 1,
  perPage: GLAZE_SUPPLIERS_PER_PAGE,
};

export function GlazeSuppliersView() {
  const t = useTranslations("glazeSuppliers");
  const { can } = useAuthorization();
  const columns = useGlazeSupplierColumns();
  const [page, setPage] = useState(1);

  const glazeSuppliersQuery = useGlazeSuppliers(
    { page, perPage: GLAZE_SUPPLIERS_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <GlazeSupplierFormDialog
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
          data={glazeSuppliersQuery.data?.data ?? []}
          getRowKey={(supplier) => supplier.id}
          isLoading={glazeSuppliersQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={glazeSuppliersQuery.data?.meta}
          page={page}
          isFetching={glazeSuppliersQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
