"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useSingleClassColumns } from "@/app/(dashboard)/single-classes/_assets/columnDefs";
import { SingleClassFormDialog } from "@/app/(dashboard)/single-classes/_components/single-class-form-dialog";
import { useSingleClasses } from "@/app/(dashboard)/single-classes/_hooks/useSingleClasses";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListSingleClassesParams } from "@/interfaces/singleClass";

const PER_PAGE = 15;

export const SINGLE_CLASSES_INITIAL_PARAMS: ListSingleClassesParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function SingleClassesView() {
  const t = useTranslations("singleClasses");
  const { can } = useAuthorization();
  const columns = useSingleClassColumns();
  const [page, setPage] = useState(1);

  const query = useSingleClasses(
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
            <SingleClassFormDialog
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
          getRowKey={(singleClass) => singleClass.id}
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
