"use client";

import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { useStudentStatement } from "@/app/(dashboard)/users/_hooks/useStudentStatement";
import { DataTable, DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentStatement } from "@/interfaces/studentStatement";
import { cn } from "@/lib/utils";
import {
  formatCurrencyFromCents,
  formatDate,
  formatDateTime,
} from "@/utils/formatters";

type StatementItem = StudentStatement["items"]["tuition"][number];
type StatementHistoryEntry = StudentStatement["history"][number];

export function StudentStatementSection({ userId }: { userId: string }) {
  const t = useTranslations("statement");
  const statementQuery = useStudentStatement(userId);

  function renderStatusBadge(status: string): ReactNode {
    if (status === "paid") {
      return <Badge variant="secondary">{t("statusPaid")}</Badge>;
    }

    if (status === "overdue") {
      return <Badge variant="destructive">{t("statusOverdue")}</Badge>;
    }

    return <Badge variant="outline">{t("statusOpen")}</Badge>;
  }

  function renderHistoryType(type: string): ReactNode {
    if (type === "tuition") {
      return t("typeTuition");
    }

    if (type === "annual_fee") {
      return t("typeAnnualFee");
    }

    if (type === "piece_charge") {
      return t("typePieceCharge");
    }

    return type;
  }

  const itemColumns: DataTableColumn<StatementItem>[] = [
    {
      id: "amount",
      header: t("columnAmount"),
      cell: (item) => formatCurrencyFromCents(item.amount),
    },
    {
      id: "dueDate",
      header: t("columnDueDate"),
      cell: (item) => formatDate(item.due_date),
    },
    {
      id: "status",
      header: t("columnStatus"),
      cell: (item) => renderStatusBadge(item.status),
    },
  ];

  const pieceChargeColumns: DataTableColumn<StatementItem>[] = [
    {
      id: "piece",
      header: t("columnPiece"),
      cell: (item) => item.piece?.name ?? "—",
    },
    {
      id: "amount",
      header: t("columnAmount"),
      cell: (item) => formatCurrencyFromCents(item.amount),
    },
    {
      id: "dueDate",
      header: t("columnDueDate"),
      cell: (item) => formatDate(item.due_date),
    },
    {
      id: "status",
      header: t("columnStatus"),
      cell: (item) => renderStatusBadge(item.status),
    },
  ];

  const historyColumns: DataTableColumn<StatementHistoryEntry>[] = [
    {
      id: "type",
      header: t("columnType"),
      cell: (entry) => renderHistoryType(entry.type),
    },
    {
      id: "amount",
      header: t("columnAmount"),
      cell: (entry) => formatCurrencyFromCents(entry.amount),
    },
    {
      id: "paidAt",
      header: t("columnPaidAt"),
      cell: (entry) => formatDateTime(entry.paid_at),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      {statementQuery.isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : null}

      {statementQuery.isError ? (
        <p className="text-muted-foreground text-sm">{t("loadError")}</p>
      ) : null}

      {statementQuery.data ? (
        <StudentStatementContent
          historyColumns={historyColumns}
          itemColumns={itemColumns}
          pieceChargeColumns={pieceChargeColumns}
          statement={statementQuery.data.data}
        />
      ) : null}
    </section>
  );
}

function StudentStatementContent({
  historyColumns,
  itemColumns,
  pieceChargeColumns,
  statement,
}: {
  historyColumns: DataTableColumn<StatementHistoryEntry>[];
  itemColumns: DataTableColumn<StatementItem>[];
  pieceChargeColumns: DataTableColumn<StatementItem>[];
  statement: StudentStatement;
}) {
  const t = useTranslations("statement");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("balanceOutstanding")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {formatCurrencyFromCents(statement.balance.total_outstanding)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("balanceOverdue")}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={cn(
              "text-2xl font-semibold tabular-nums",
              statement.balance.overdue > 0 ? "text-destructive" : undefined,
            )}
          >
            {formatCurrencyFromCents(statement.balance.overdue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t("balanceUpcoming")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {formatCurrencyFromCents(statement.balance.upcoming)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("sectionTuition")}</h3>
        <DataTable
          columns={itemColumns}
          data={statement.items.tuition}
          getRowKey={(item) => item.id}
          emptyMessage={t("empty")}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("sectionAnnualFees")}</h3>
        <DataTable
          columns={itemColumns}
          data={statement.items.annual_fees}
          getRowKey={(item) => item.id}
          emptyMessage={t("empty")}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("sectionPieceCharges")}</h3>
        <DataTable
          columns={pieceChargeColumns}
          data={statement.items.piece_charges}
          getRowKey={(item) => item.id}
          emptyMessage={t("empty")}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("sectionHistory")}</h3>
        <DataTable
          columns={historyColumns}
          data={statement.history}
          getRowKey={(entry) =>
            `${entry.type}-${entry.paid_at}-${entry.amount}`
          }
          emptyMessage={t("empty")}
        />
      </div>
    </div>
  );
}
