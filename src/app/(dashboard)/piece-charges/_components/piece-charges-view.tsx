"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { usePieceChargeColumns } from "@/app/(dashboard)/piece-charges/_assets/columnDefs";
import { usePieceCharges } from "@/app/(dashboard)/piece-charges/_hooks/usePieceCharges";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListPieceChargesParams } from "@/interfaces/pieceCharge";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listPieces } from "@/services/pieceService";
import { listUsers } from "@/services/userService";

const PER_PAGE = 15;
const LOOKUP_LIMIT = 100;
const ALL_FILTER = "all";

type StatusFilter = "all" | "paid" | "unpaid";

export const PIECE_CHARGES_INITIAL_PARAMS: ListPieceChargesParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function PieceChargesView() {
  const t = useTranslations("pieceCharges");
  const { can } = useAuthorization();
  const canManage = can("atelier.manage");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER);
  const [userId, setUserId] = useState<string>(ALL_FILTER);

  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: LOOKUP_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: LOOKUP_LIMIT }),
    enabled: canManage,
  });
  const piecesQuery = useQuery({
    queryKey: queryKeys.piecesList({ page: 1, perPage: LOOKUP_LIMIT }),
    queryFn: () => listPieces({ page: 1, perPage: LOOKUP_LIMIT }),
    enabled: canManage,
  });

  const userNames = useMemo(
    () =>
      new Map(
        (usersQuery.data?.data ?? []).map((user) => [user.id, user.name]),
      ),
    [usersQuery.data],
  );
  const pieceNames = useMemo(
    () =>
      new Map(
        (piecesQuery.data?.data ?? []).map((piece) => [piece.id, piece.name]),
      ),
    [piecesQuery.data],
  );

  const columns = usePieceChargeColumns({ pieceNames, userNames });

  const query = usePieceCharges(
    {
      page,
      perPage: PER_PAGE,
      status: status === ALL_FILTER ? undefined : status,
      user_id: userId === ALL_FILTER ? undefined : userId,
    },
    { enabled: canManage },
  );

  const onStatusChange = (value: string) => {
    setPage(1);
    setStatus(value as StatusFilter);
  };

  const onUserChange = (value: string) => {
    setPage(1);
    setUserId(value);
  };

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle title={t("title")} description={t("description")} />

        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterStatusAll")}</SelectItem>
              <SelectItem value="paid">{t("filterStatusPaid")}</SelectItem>
              <SelectItem value="unpaid">{t("filterStatusUnpaid")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={userId} onValueChange={onUserChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>
                {t("filterStudentAll")}
              </SelectItem>
              {toStudentOptions(usersQuery.data?.data).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          getRowKey={(charge) => charge.id}
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
