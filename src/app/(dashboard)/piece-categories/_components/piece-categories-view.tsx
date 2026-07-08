"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { usePieceCategoryColumns } from "@/app/(dashboard)/piece-categories/_assets/columnDefs";
import { PieceCategoryFormDialog } from "@/app/(dashboard)/piece-categories/_components/piece-category-form-dialog";
import { usePieceCategories } from "@/app/(dashboard)/piece-categories/_hooks/usePieceCategories";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListPieceCategoriesParams } from "@/interfaces/pieceCategory";

const PIECE_CATEGORIES_PER_PAGE = 15;

export const PIECE_CATEGORIES_INITIAL_PARAMS: ListPieceCategoriesParams = {
  page: 1,
  perPage: PIECE_CATEGORIES_PER_PAGE,
};

export function PieceCategoriesView() {
  const t = useTranslations("pieceCategories");
  const { can } = useAuthorization();
  const columns = usePieceCategoryColumns();
  const [page, setPage] = useState(1);

  const pieceCategoriesQuery = usePieceCategories(
    { page, perPage: PIECE_CATEGORIES_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <PieceCategoryFormDialog
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
          data={pieceCategoriesQuery.data?.data ?? []}
          getRowKey={(category) => category.id}
          isLoading={pieceCategoriesQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={pieceCategoriesQuery.data?.meta}
          page={page}
          isFetching={pieceCategoriesQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
