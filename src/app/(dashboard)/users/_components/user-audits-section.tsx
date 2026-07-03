"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useAuditColumns } from "@/app/(dashboard)/audits/_assets/auditColumns";
import { useUserAudits } from "@/app/(dashboard)/audits/_hooks/useAudits";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { HttpError } from "@/utils/httpError";
import { HttpStatusType } from "@/types/httpStatus";

const AUDITS_PER_PAGE = 10;

export function UserAuditsSection({ userId }: { userId: string }) {
  const t = useTranslations("users");
  const auditsT = useTranslations("audits");
  const columns = useAuditColumns();
  const [page, setPage] = useState(1);
  const auditsQuery = useUserAudits(userId, { page, perPage: AUDITS_PER_PAGE });

  const isForbidden =
    auditsQuery.error instanceof HttpError &&
    auditsQuery.error.status === HttpStatusType.FORBIDDEN;

  if (isForbidden) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{t("auditsTitle")}</h2>
      <DataTable
        columns={columns}
        data={auditsQuery.data?.data ?? []}
        getRowKey={(audit) => audit.id}
        isLoading={auditsQuery.isPending}
        emptyMessage={t("auditsEmpty")}
      />
      <PaginationControls
        meta={auditsQuery.data?.meta}
        page={page}
        isFetching={auditsQuery.isFetching}
        itemLabel={auditsT("itemLabel")}
        onPageChange={setPage}
      />
    </section>
  );
}
