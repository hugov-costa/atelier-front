"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { useMarkNotificationRead } from "@/app/(dashboard)/notifications/_hooks/useNotificationMutations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Notification } from "@/interfaces/notification";
import {
  formatCurrencyFromCents,
  formatDate,
  formatDateTime,
} from "@/utils/formatters";

const KNOWN_TYPES = [
  "annual_fee_due",
  "billing_statement",
  "enrollment_created",
  "piece_charge_created",
];

function readString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = data[key];

  return typeof value === "string" ? value : undefined;
}

function readNumber(
  data: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = data[key];

  return typeof value === "number" ? value : undefined;
}

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const t = useTranslations("notifications");
  const enumsT = useTranslations("enums");
  const markRead = useMarkNotificationRead();

  const isUnread = !notification.read_at;
  const message = readString(notification.data, "message");
  const amount =
    readNumber(notification.data, "amount") ??
    readNumber(notification.data, "total");
  const dueDate = readString(notification.data, "due_date");
  const typeLabel = KNOWN_TYPES.includes(notification.type)
    ? enumsT(`notificationType.${notification.type}`)
    : notification.type;

  return (
    <Card className={isUnread ? "border-primary/40" : undefined}>
      <CardContent className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{typeLabel}</Badge>
            <Badge variant={isUnread ? "default" : "outline"}>
              {isUnread ? t("badgeUnread") : t("badgeRead")}
            </Badge>
          </div>
          {message ? <p className="text-sm">{message}</p> : null}
          <div className="text-muted-foreground flex flex-wrap gap-x-4 text-xs">
            {amount != null ? (
              <span>{formatCurrencyFromCents(amount)}</span>
            ) : null}
            {dueDate ? (
              <span>
                {t("dueDate")}: {formatDate(dueDate)}
              </span>
            ) : null}
            <span>{formatDateTime(notification.created_at)}</span>
          </div>
        </div>

        {isUnread ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={markRead.isPending}
            onClick={() => markRead.mutate(notification.id)}
          >
            <Check className="size-4" />
            {t("markRead")}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
