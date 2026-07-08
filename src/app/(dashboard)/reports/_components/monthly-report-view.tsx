"use client";

import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

import { useMonthlyReport } from "@/app/(dashboard)/reports/_hooks/useMonthlyReport";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorization } from "@/hooks/useAuthorization";
import { MonthlyReport } from "@/interfaces/monthlyReport";
import { Month, months } from "@/lib/enums";
import { formatCurrencyFromCents } from "@/utils/formatters";

const YEAR_SPAN = 6;

function buildYearOptions(currentYear: number): number[] {
  return Array.from(
    { length: YEAR_SPAN + 1 },
    (_, index) => currentYear + 1 - index,
  );
}

function AmountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

interface MonthlyReportViewProps {
  initialMonth: Month;
  initialYear: number;
}

export function MonthlyReportView({
  initialMonth,
  initialYear,
}: MonthlyReportViewProps) {
  const t = useTranslations("reports");
  const enumsT = useTranslations("enums");
  const { can } = useAuthorization();
  const canView = can("reports.view");

  const [month, setMonth] = useState<Month>(initialMonth);
  const [year, setYear] = useState<number>(initialYear);

  const yearOptions = buildYearOptions(initialYear);
  const query = useMonthlyReport({ month, year }, { enabled: canView });
  const report = query.data;

  return (
    <RequirePermission permission="reports.view" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <div className="flex flex-wrap gap-3">
              <Select
                value={String(month)}
                onValueChange={(value) => setMonth(Number(value) as Month)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {enumsT(`month.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(year)}
                onValueChange={(value) => setYear(Number(value))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />

        {query.isError ? (
          <p className="text-muted-foreground text-sm">{t("loadError")}</p>
        ) : null}

        {report ? (
          <ReportContent report={report} />
        ) : query.isPending ? (
          <p className="text-muted-foreground text-sm">…</p>
        ) : null}
      </div>
    </RequirePermission>
  );
}

function ReportContent({ report }: { report: MonthlyReport }) {
  const t = useTranslations("reports");
  const enumsT = useTranslations("enums");

  const netPositive = report.net >= 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("revenueTotal")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrencyFromCents(report.revenue.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("expensesTotal")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrencyFromCents(report.expenses.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("net")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold tabular-nums ${
                netPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              }`}
            >
              {formatCurrencyFromCents(report.net)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title={t("sectionRevenue")}>
          <AmountRow
            label={t("revenueTuition")}
            value={formatCurrencyFromCents(report.revenue.tuition_paid)}
          />
          <AmountRow
            label={t("revenueAnnualFees")}
            value={formatCurrencyFromCents(report.revenue.annual_fees_paid)}
          />
          <AmountRow
            label={t("revenuePieceCharges")}
            value={formatCurrencyFromCents(report.revenue.piece_charges_paid)}
          />
          <AmountRow
            label={t("revenueCommissionSales")}
            value={formatCurrencyFromCents(report.revenue.commission_sales)}
          />
          <AmountRow
            label={t("revenueTotal")}
            value={formatCurrencyFromCents(report.revenue.total)}
          />
        </SectionCard>

        <SectionCard title={t("sectionExpenses")}>
          <AmountRow
            label={t("expensesBills")}
            value={formatCurrencyFromCents(report.expenses.bills_total)}
          />
          <AmountRow
            label={t("expensesMaterials")}
            value={formatCurrencyFromCents(report.expenses.materials_total)}
          />
          <AmountRow
            label={t("expensesCommissionShipping")}
            value={formatCurrencyFromCents(report.expenses.commission_shipping)}
          />
          <AmountRow
            label={t("expensesTotal")}
            value={formatCurrencyFromCents(report.expenses.total)}
          />
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title={t("sectionCommission")}>
          <AmountRow
            label={t("commissionOrdersPaid")}
            value={String(report.commission.orders_paid_count)}
          />
          <AmountRow
            label={t("commissionSales")}
            value={formatCurrencyFromCents(report.commission.sales)}
          />
          <AmountRow
            label={t("commissionProductionCost")}
            value={formatCurrencyFromCents(report.commission.production_cost)}
          />
          <AmountRow
            label={t("commissionShippingCost")}
            value={formatCurrencyFromCents(report.commission.shipping_cost)}
          />
          <AmountRow
            label={t("commissionMargin")}
            value={formatCurrencyFromCents(report.commission.realized_margin)}
          />
        </SectionCard>

        <SectionCard title={t("sectionTuition")}>
          <AmountRow
            label={t("tuitionPaid")}
            value={String(report.tuition.paid_count)}
          />
          <AmountRow
            label={t("tuitionDue")}
            value={String(report.tuition.due_count)}
          />
          <AmountRow
            label={t("tuitionUnpaid")}
            value={String(report.tuition.unpaid_count)}
          />
        </SectionCard>

        <SectionCard title={t("sectionCounts")}>
          <AmountRow
            label={t("countsActiveStudents")}
            value={String(report.counts.active_students)}
          />
          <AmountRow
            label={t("countsNewEnrollments")}
            value={String(report.counts.new_enrollments)}
          />
        </SectionCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sectionProduction")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AmountRow
            label={t("productionPieces")}
            value={String(report.production.pieces_produced)}
          />
          <DataTable
            columns={[
              {
                id: "category",
                header: t("columnCategory"),
                cell: (row) => row.category ?? t("uncategorized"),
              },
              {
                id: "count",
                header: t("columnCount"),
                cell: (row) => row.count,
              },
              {
                id: "priceTotal",
                header: t("columnPriceTotal"),
                cell: (row) => formatCurrencyFromCents(row.price_total),
              },
              {
                id: "costTotal",
                header: t("columnCostTotal"),
                cell: (row) =>
                  formatCurrencyFromCents(row.production_cost_total),
              },
              {
                id: "margin",
                header: t("columnMargin"),
                cell: (row) => formatCurrencyFromCents(row.margin),
              },
            ]}
            data={report.production.by_category}
            getRowKey={(row) => row.category ?? "__uncategorized__"}
            emptyMessage={t("productionEmpty")}
          />
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs">
        {enumsT(`month.${report.period.month}`)} · {report.period.year}
      </p>
    </div>
  );
}
