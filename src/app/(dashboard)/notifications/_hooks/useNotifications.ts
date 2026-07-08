"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListNotificationsParams } from "@/interfaces/notification";
import { queryKeys } from "@/lib/queryKeys";
import { listNotifications } from "@/services/notificationService";

interface UseNotificationsOptions {
  enabled?: boolean;
}

export function useNotifications(
  params: ListNotificationsParams,
  options: UseNotificationsOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.notificationsList(params),
    queryFn: () => listNotifications(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}
