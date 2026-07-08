"use client";

import { useTranslations } from "next-intl";

import { useUserColumns } from "@/app/(dashboard)/users/_assets/columnDefs";
import { UserCreateDialog } from "@/app/(dashboard)/users/_components/user-create-dialog";
import { useUsers } from "@/app/(dashboard)/users/_hooks/useUsers";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Input } from "@/components/ui/input";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useListController } from "@/hooks/useListController";
import { ListUsersParams } from "@/interfaces/userResponse";

const USERS_PER_PAGE = 10;

export const USERS_INITIAL_PARAMS: ListUsersParams = {
  page: 1,
  perPage: USERS_PER_PAGE,
  search: "",
  sort: "created_at",
  direction: "desc",
};

export function UsersView() {
  const t = useTranslations("users");
  const { can } = useAuthorization();
  const columns = useUserColumns();
  const {
    page,
    perPage,
    setPage,
    search,
    debouncedSearch,
    onSearchChange,
    sort,
    onSortChange,
  } = useListController({
    perPage: USERS_PER_PAGE,
    initialSort: { key: "created_at", direction: "desc" },
  });

  const usersQuery = useUsers(
    {
      page,
      perPage,
      search: debouncedSearch,
      sort: sort?.key,
      direction: sort?.direction,
    },
    { enabled: can("users.view") },
  );

  return (
    <RequirePermission permission="users.view" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={<UserCreateDialog />}
        />

        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          className="max-w-sm"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <DataTable
          columns={columns}
          data={usersQuery.data?.data ?? []}
          getRowKey={(user) => user.id}
          isLoading={usersQuery.isPending}
          emptyMessage={t("empty")}
          sort={sort}
          onSortChange={onSortChange}
        />

        <PaginationControls
          meta={usersQuery.data?.meta}
          page={page}
          isFetching={usersQuery.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
