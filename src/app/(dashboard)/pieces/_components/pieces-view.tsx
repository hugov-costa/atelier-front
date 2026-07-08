"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { usePieceColumns } from "@/app/(dashboard)/pieces/_assets/columnDefs";
import { PieceFormDialog } from "@/app/(dashboard)/pieces/_components/piece-form-dialog";
import { usePieces } from "@/app/(dashboard)/pieces/_hooks/usePieces";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListPiecesParams } from "@/interfaces/piece";

const PIECES_PER_PAGE = 15;

export const PIECES_INITIAL_PARAMS: ListPiecesParams = {
  page: 1,
  perPage: PIECES_PER_PAGE,
};

export function PiecesView() {
  const t = useTranslations("pieces");
  const { can } = useAuthorization();
  const columns = usePieceColumns();
  const [page, setPage] = useState(1);

  const piecesQuery = usePieces(
    { page, perPage: PIECES_PER_PAGE },
    { enabled: can("atelier.manage") },
  );

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <PieceFormDialog
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
          data={piecesQuery.data?.data ?? []}
          getRowKey={(piece) => piece.id}
          isLoading={piecesQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={piecesQuery.data?.meta}
          page={page}
          isFetching={piecesQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
