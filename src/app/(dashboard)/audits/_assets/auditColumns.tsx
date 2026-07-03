"use client";

import { useTranslations } from "next-intl";

import { Audit, AuditEvent } from "@/interfaces/audit";
import { DataTableColumn } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/formatters";

const eventLabelKeys: Record<AuditEvent, string> = {
  created: "eventCreated",
  updated: "eventUpdated",
  deleted: "eventDeleted",
  restored: "eventRestored",
};

function shortEntityName(auditableType: string): string {
  const segments = auditableType.split("\\");
  return segments[segments.length - 1] ?? auditableType;
}

function summarizeChangedFields(values: Record<string, unknown>): string {
  const keys = Object.keys(values);
  return keys.length > 0 ? keys.join(", ") : "—";
}

export function useAuditColumns(): DataTableColumn<Audit>[] {
  const t = useTranslations("audits");

  return [
    {
      id: "event",
      header: t("columnEvent"),
      cell: (audit) => (
        <Badge variant="secondary">
          {eventLabelKeys[audit.event]
            ? t(eventLabelKeys[audit.event])
            : audit.event}
        </Badge>
      ),
    },
    {
      id: "entity",
      header: t("columnEntity"),
      cell: (audit) => shortEntityName(audit.auditable_type),
    },
    {
      id: "changes",
      header: t("columnChanges"),
      cell: (audit) => summarizeChangedFields(audit.new_values),
    },
    {
      id: "ip",
      header: t("columnIp"),
      cell: (audit) => audit.ip_address ?? "—",
    },
    {
      id: "createdAt",
      header: t("columnDate"),
      cell: (audit) => formatDateTime(audit.created_at),
    },
  ];
}
