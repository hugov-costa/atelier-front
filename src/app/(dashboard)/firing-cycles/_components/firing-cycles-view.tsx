"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useFiringCycleColumns } from "@/app/(dashboard)/firing-cycles/_assets/columnDefs";
import { FiringCycleFormDialog } from "@/app/(dashboard)/firing-cycles/_components/firing-cycle-form-dialog";
import { useFiringCycles } from "@/app/(dashboard)/firing-cycles/_hooks/useFiringCycles";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListFiringCyclesParams } from "@/interfaces/firingCycle";

const FIRING_CYCLES_PER_PAGE = 15;

export const FIRING_CYCLES_INITIAL_PARAMS: ListFiringCyclesParams = {
  page: 1,
  perPage: FIRING_CYCLES_PER_PAGE,
};

export function FiringCyclesView() {
  const t = useTranslations("firingCycles");
  const { can } = useAuthorization();
  const columns = useFiringCycleColumns();
  const [page, setPage] = useState(1);

  const firingCyclesQuery = useFiringCycles(
    { page, perPage: FIRING_CYCLES_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <FiringCycleFormDialog
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
          data={firingCyclesQuery.data?.data ?? []}
          getRowKey={(cycle) => cycle.id}
          isLoading={firingCyclesQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={firingCyclesQuery.data?.meta}
          page={page}
          isFetching={firingCyclesQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
