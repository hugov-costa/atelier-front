"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useBillColumns } from "@/app/(dashboard)/bills/_assets/columnDefs";
import { BillFormDialog } from "@/app/(dashboard)/bills/_components/bill-form-dialog";
import { useBills } from "@/app/(dashboard)/bills/_hooks/useBills";
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
import { ListBillsParams } from "@/interfaces/bill";
import { Month, months } from "@/lib/enums";
import { getCurrentYear } from "@/utils/formatters";

const PER_PAGE = 15;
const ALL_FILTER = "all";
const YEARS_RANGE = 7;

type RecurrentFilter = "all" | "yes" | "no";

export const BILLS_INITIAL_PARAMS: ListBillsParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function BillsView() {
  const t = useTranslations("bills");
  const enumsT = useTranslations("enums");
  const { can } = useAuthorization();
  const columns = useBillColumns();
  const [page, setPage] = useState(1);
  const [yearFilter, setYearFilter] = useState<string>(ALL_FILTER);
  const [monthFilter, setMonthFilter] = useState<string>(ALL_FILTER);
  const [recurrentFilter, setRecurrentFilter] =
    useState<RecurrentFilter>(ALL_FILTER);

  const currentYear = getCurrentYear();
  const years = Array.from(
    { length: YEARS_RANGE },
    (_, index) => currentYear + 1 - index,
  );

  const query = useBills(
    {
      page,
      perPage: PER_PAGE,
      is_recurrent:
        recurrentFilter === ALL_FILTER ? undefined : recurrentFilter === "yes",
      reference_month:
        monthFilter === ALL_FILTER ? undefined : (Number(monthFilter) as Month),
      reference_year:
        yearFilter === ALL_FILTER ? undefined : Number(yearFilter),
    },
    { enabled: can("atelier.manage") },
  );

  const onYearChange = (value: string) => {
    setPage(1);
    setYearFilter(value);
  };

  const onMonthChange = (value: string) => {
    setPage(1);
    setMonthFilter(value);
  };

  const onRecurrentChange = (value: string) => {
    setPage(1);
    setRecurrentFilter(value as RecurrentFilter);
  };

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <BillFormDialog
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
          <Select value={yearFilter} onValueChange={onYearChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterYearAll")}</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={monthFilter} onValueChange={onMonthChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterMonthAll")}</SelectItem>
              {months.map((month) => (
                <SelectItem key={month} value={String(month)}>
                  {enumsT(`month.${month}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={recurrentFilter} onValueChange={onRecurrentChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>
                {t("filterRecurrentAll")}
              </SelectItem>
              <SelectItem value="yes">{t("filterRecurrentYes")}</SelectItem>
              <SelectItem value="no">{t("filterRecurrentNo")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          getRowKey={(bill) => bill.id}
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
