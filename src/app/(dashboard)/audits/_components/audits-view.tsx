"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useAuditColumns } from "@/app/(dashboard)/audits/_assets/auditColumns";
import { useAudits } from "@/app/(dashboard)/audits/_hooks/useAudits";
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
import { AuditEvent, AuditFilterParams } from "@/interfaces/audit";

const AUDITS_PER_PAGE = 15;
const ALL_EVENTS = "all";

export const AUDITS_INITIAL_PARAMS: AuditFilterParams = {
  page: 1,
  perPage: AUDITS_PER_PAGE,
  event: undefined,
};

const eventValues: Array<AuditEvent | typeof ALL_EVENTS> = [
  ALL_EVENTS,
  "created",
  "updated",
  "deleted",
  "restored",
];

const eventLabelKeys: Record<AuditEvent, string> = {
  created: "eventCreated",
  updated: "eventUpdated",
  deleted: "eventDeleted",
  restored: "eventRestored",
};

export function AuditsView() {
  const t = useTranslations("audits");
  const columns = useAuditColumns();
  const [page, setPage] = useState(1);
  const [event, setEvent] = useState<AuditEvent | typeof ALL_EVENTS>(
    ALL_EVENTS,
  );

  const auditsQuery = useAudits({
    page,
    perPage: AUDITS_PER_PAGE,
    event: event === ALL_EVENTS ? undefined : event,
  });

  return (
    <RequirePermission permission="audits.view" title={t("title")}>
      <div className="space-y-6">
        <PageTitle title={t("title")} description={t("description")} />

        <Select
          value={event}
          onValueChange={(value) => {
            setPage(1);
            setEvent(value as AuditEvent | typeof ALL_EVENTS);
          }}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value === ALL_EVENTS
                  ? t("filterAll")
                  : t(eventLabelKeys[value])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DataTable
          columns={columns}
          data={auditsQuery.data?.data ?? []}
          getRowKey={(audit) => audit.id}
          isLoading={auditsQuery.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={auditsQuery.data?.meta}
          page={page}
          isFetching={auditsQuery.isFetching}
          itemLabel={t("itemLabel")}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}
