"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useEnrollmentColumns } from "@/app/(dashboard)/enrollments/_assets/columnDefs";
import { EnrollmentFormDialog } from "@/app/(dashboard)/enrollments/_components/enrollment-form-dialog";
import { useEnrollments } from "@/app/(dashboard)/enrollments/_hooks/useEnrollments";
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
import { ListEnrollmentsParams } from "@/interfaces/enrollment";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listUsers } from "@/services/userService";

const PER_PAGE = 15;
const LOOKUP_LIMIT = 100;
const ALL_FILTER = "all";

type StatusFilter = "all" | "paid" | "unpaid";

export const ENROLLMENTS_INITIAL_PARAMS: ListEnrollmentsParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function EnrollmentsView() {
  const t = useTranslations("enrollments");
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

  const userNames = useMemo(
    () =>
      new Map(
        (usersQuery.data?.data ?? []).map((user) => [user.id, user.name]),
      ),
    [usersQuery.data],
  );

  const columns = useEnrollmentColumns({ userNames });

  const query = useEnrollments(
    {
      page,
      perPage: PER_PAGE,
      annual_fee_is_paid: status === ALL_FILTER ? undefined : status === "paid",
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
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <EnrollmentFormDialog
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
              <SelectItem value={ALL_FILTER}>{t("filterPaidAll")}</SelectItem>
              <SelectItem value="paid">{t("filterPaidPaid")}</SelectItem>
              <SelectItem value="unpaid">{t("filterPaidUnpaid")}</SelectItem>
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
          getRowKey={(enrollment) => enrollment.id}
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
