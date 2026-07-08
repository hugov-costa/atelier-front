"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useGlazeColumns } from "@/app/(dashboard)/glazes/_assets/columnDefs";
import { GlazeFormDialog } from "@/app/(dashboard)/glazes/_components/glaze-form-dialog";
import { useGlazes } from "@/app/(dashboard)/glazes/_hooks/useGlazes";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListGlazesParams } from "@/interfaces/glaze";
import { queryKeys } from "@/lib/queryKeys";
import { listGlazeSuppliers } from "@/services/glazeSupplierService";

const GLAZES_PER_PAGE = 15;
const SUPPLIER_LOOKUP_LIMIT = 100;

export const GLAZES_INITIAL_PARAMS: ListGlazesParams = {
  page: 1,
  perPage: GLAZES_PER_PAGE,
};

export function GlazesView() {
  const t = useTranslations("glazes");
  const { can } = useAuthorization();
  const [page, setPage] = useState(1);
  const canManage = can("atelier.manage");

  const glazesQuery = useGlazes(
    { page, perPage: GLAZES_PER_PAGE },
    { enabled: canManage },
  );

  const suppliersQuery = useQuery({
    queryKey: queryKeys.glazeSuppliersList({
      page: 1,
      perPage: SUPPLIER_LOOKUP_LIMIT,
    }),
    queryFn: () =>
      listGlazeSuppliers({ page: 1, perPage: SUPPLIER_LOOKUP_LIMIT }),
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

  const columns = useGlazeColumns(supplierNameById);

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <GlazeFormDialog
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
          data={glazesQuery.data?.data ?? []}
          getRowKey={(glaze) => glaze.id}
          isLoading={glazesQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={glazesQuery.data?.meta}
          page={page}
          isFetching={glazesQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
