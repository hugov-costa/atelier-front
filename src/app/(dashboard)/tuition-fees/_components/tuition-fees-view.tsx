"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useTuitionFeeColumns } from "@/app/(dashboard)/tuition-fees/_assets/columnDefs";
import { TuitionFeeFormDialog } from "@/app/(dashboard)/tuition-fees/_components/tuition-fee-form-dialog";
import { useTuitionFees } from "@/app/(dashboard)/tuition-fees/_hooks/useTuitionFees";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListTuitionFeesParams } from "@/interfaces/tuitionFee";
import { queryKeys } from "@/lib/queryKeys";
import { listEnrollments } from "@/services/enrollmentService";
import { listUsers } from "@/services/userService";

const PER_PAGE = 15;
const LOOKUP_LIMIT = 100;
const ALL_FILTER = "all";

type StatusFilter = "all" | "paid" | "unpaid";

export const TUITION_FEES_INITIAL_PARAMS: ListTuitionFeesParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function TuitionFeesView() {
  const t = useTranslations("tuitionFees");
  const { can } = useAuthorization();
  const canManage = can("atelier.manage");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER);

  const enrollmentsQuery = useQuery({
    queryKey: queryKeys.enrollmentsList({ page: 1, perPage: LOOKUP_LIMIT }),
    queryFn: () => listEnrollments({ page: 1, perPage: LOOKUP_LIMIT }),
    enabled: canManage,
  });
  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: LOOKUP_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: LOOKUP_LIMIT }),
    enabled: canManage,
  });

  const userNames = useMemo(
    () =>
      new Map(
        (usersQuery.data?.data ?? []).map((user) => [user.id, user.name]),
      ),
    [usersQuery.data],
  );

  const studentNames = useMemo(
    () =>
      new Map(
        (enrollmentsQuery.data?.data ?? []).map((enrollment) => [
          enrollment.id,
          userNames.get(enrollment.user_id) ?? "—",
        ]),
      ),
    [enrollmentsQuery.data, userNames],
  );

  const columns = useTuitionFeeColumns({ studentNames });

  const query = useTuitionFees(
    {
      page,
      perPage: PER_PAGE,
      status: status === ALL_FILTER ? undefined : status,
    },
    { enabled: canManage },
  );

  const onStatusChange = (value: string) => {
    setPage(1);
    setStatus(value as StatusFilter);
  };

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <TuitionFeeFormDialog
              trigger={
                <Button>
                  <Plus className="size-4" />
                  {t("new")}
                </Button>
              }
            />
          }
        />

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
        </div>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          getRowKey={(fee) => fee.id}
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
