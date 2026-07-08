"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useClayColumns } from "@/app/(dashboard)/clays/_assets/columnDefs";
import { ClayFormDialog } from "@/app/(dashboard)/clays/_components/clay-form-dialog";
import { useClays } from "@/app/(dashboard)/clays/_hooks/useClays";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListClaysParams } from "@/interfaces/clay";
import { queryKeys } from "@/lib/queryKeys";
import { listClaySuppliers } from "@/services/claySupplierService";

const CLAYS_PER_PAGE = 15;
const SUPPLIER_LOOKUP_LIMIT = 100;

export const CLAYS_INITIAL_PARAMS: ListClaysParams = {
  page: 1,
  perPage: CLAYS_PER_PAGE,
};

export function ClaysView() {
  const t = useTranslations("clays");
  const { can } = useAuthorization();
  const [page, setPage] = useState(1);
  const canManage = can("atelier.manage");

  const claysQuery = useClays(
    { page, perPage: CLAYS_PER_PAGE },
    { enabled: canManage },
  );

  const suppliersQuery = useQuery({
    queryKey: queryKeys.claySuppliersList({
      page: 1,
      perPage: SUPPLIER_LOOKUP_LIMIT,
    }),
    queryFn: () =>
      listClaySuppliers({ page: 1, perPage: SUPPLIER_LOOKUP_LIMIT }),
    enabled: canManage,
  });

  const supplierNameById = useMemo(
    () =>
      Object.fromEntries(
        (suppliersQuery.data?.data ?? []).map((supplier) => [
          supplier.id,
          supplier.name,
        ]),
      ),
    [suppliersQuery.data],
  );

  const columns = useClayColumns(supplierNameById);

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <ClayFormDialog
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
          data={claysQuery.data?.data ?? []}
          getRowKey={(clay) => clay.id}
          isLoading={claysQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={claysQuery.data?.meta}
          page={page}
          isFetching={claysQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
