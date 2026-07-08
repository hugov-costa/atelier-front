"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notificationService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

export function useMarkNotificationRead() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationsLists,
      });
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "notificationReadError"));
    },
  });
}

export function useMarkAllNotificationsRead() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationsLists,
      });
      toast.success(t("notificationsRead"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "notificationReadError"));
    },
  });
}
