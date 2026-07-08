"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { NotificationItem } from "@/app/(dashboard)/notifications/_components/notification-item";
import { useMarkAllNotificationsRead } from "@/app/(dashboard)/notifications/_hooks/useNotificationMutations";
import { useNotifications } from "@/app/(dashboard)/notifications/_hooks/useNotifications";
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
import { ListNotificationsParams } from "@/interfaces/notification";

const PER_PAGE = 15;

type NotificationFilter = "all" | "unread";

export const NOTIFICATIONS_INITIAL_PARAMS: ListNotificationsParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function NotificationsView() {
  const t = useTranslations("notifications");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const query = useNotifications({
    page,
    perPage: PER_PAGE,
    unread: filter === "unread" ? true : undefined,
  });
  const markAll = useMarkAllNotificationsRead();

  const notifications = query.data?.data ?? [];

  const onFilterChange = (value: string) => {
    setPage(1);
    setFilter(value as NotificationFilter);
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={t("title")}
        description={t("description")}
        action={
          <Button
            type="button"
            variant="outline"
            disabled={markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            <CheckCheck className="size-4" />
            {t("markAllRead")}
          </Button>
        }
      />

      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filterAll")}</SelectItem>
          <SelectItem value="unread">{t("filterUnread")}</SelectItem>
        </SelectContent>
      </Select>

      {query.isPending ? (
        <p className="text-muted-foreground text-sm">…</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}

      <PaginationControls
        meta={query.data?.meta}
        page={page}
        isFetching={query.isFetching}
        onPageChange={setPage}
      />
    </div>
  );
}
