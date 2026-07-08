"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { EnrollmentRowActions } from "@/app/(dashboard)/enrollments/_components/enrollment-row-actions";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Enrollment } from "@/interfaces/enrollment";
import { formatCurrencyFromCents, formatDate } from "@/utils/formatters";

interface UseEnrollmentColumnsOptions {
  userNames: Map<string, string>;
}

export function useEnrollmentColumns({
  userNames,
}: UseEnrollmentColumnsOptions): DataTableColumn<Enrollment>[] {
  const t = useTranslations("enrollments");

  return useMemo<DataTableColumn<Enrollment>[]>(
    () => [
      {
        id: "student",
        header: t("columnStudent"),
        cell: (enrollment) => userNames.get(enrollment.user_id) ?? "—",
      },
      {
        id: "annualFee",
        header: t("columnAnnualFee"),
        cell: (enrollment) => formatCurrencyFromCents(enrollment.annual_fee),
      },
      {
        id: "dueDate",
        header: t("columnDueDate"),
        cell: (enrollment) => formatDate(enrollment.annual_fee_due_date),
      },
      {
        id: "paid",
        header: t("columnPaid"),
        cell: (enrollment) => (
          <Badge
            variant={enrollment.annual_fee_is_paid ? "default" : "outline"}
          >
            {enrollment.annual_fee_is_paid ? t("badgePaid") : t("badgeUnpaid")}
          </Badge>
        ),
      },
      {
        id: "exemptions",
        header: t("columnExemptions"),
        cell: (enrollment) => {
          const labels: string[] = [];

          if (enrollment.is_exempt_from_annual_fee) {
            labels.push(t("badgeExemptAnnualFee"));
          }
          if (enrollment.is_exempt_from_piece_charges) {
            labels.push(t("badgeExemptPieceCharges"));
          }
          if (enrollment.is_exempt_from_tuition_fee) {
            labels.push(t("badgeExemptTuitionFee"));
          }

          if (labels.length === 0) {
            return t("exemptNone");
          }

          return (
            <span className="flex flex-wrap gap-1">
              {labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: <span className="sr-only">{t("columnActions")}</span>,
        headerClassName: "text-right",
        cell: (enrollment) => <EnrollmentRowActions enrollment={enrollment} />,
      },
    ],
    [t, userNames],
  );
}
