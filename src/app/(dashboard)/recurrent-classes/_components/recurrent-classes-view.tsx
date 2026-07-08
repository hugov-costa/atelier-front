"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRecurrentClassColumns } from "@/app/(dashboard)/recurrent-classes/_assets/columnDefs";
import { RecurrentClassFormDialog } from "@/app/(dashboard)/recurrent-classes/_components/recurrent-class-form-dialog";
import { useRecurrentClasses } from "@/app/(dashboard)/recurrent-classes/_hooks/useRecurrentClasses";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListRecurrentClassesParams } from "@/interfaces/recurrentClass";

const PER_PAGE = 15;

export const RECURRENT_CLASSES_INITIAL_PARAMS: ListRecurrentClassesParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function RecurrentClassesView() {
  const t = useTranslations("recurrentClasses");
  const { can } = useAuthorization();
  const columns = useRecurrentClassColumns();
  const [page, setPage] = useState(1);

  const query = useRecurrentClasses(
    {
      page,
      perPage: PER_PAGE,
    },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <RecurrentClassFormDialog
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
          data={query.data?.data ?? []}
          getRowKey={(recurrentClass) => recurrentClass.id}
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
